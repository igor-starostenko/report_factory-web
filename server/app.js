// server/app.js
const express = require('express');
const morgan = require('morgan');
const path = require('path');
const proxy = require('express-http-proxy');
const url = require('url');

const app = express();

const apiUrl = process.env.API_URL;

if (!apiUrl) {
  throw new Error(
    'API_URL is not set. Please follow the documentation on https://github.com/igor-starostenko/report_factory',
  );
}

// Setup logger
app.use(
  morgan(
    ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] :response-time ms',
  ),
);

// Serve static assets
app.use(express.static(path.resolve(__dirname, '../public')));

// Use proxy to redirect to API_URL in PROD
app.use(
  '/api',
  proxy(apiUrl, {
    proxyReqPathResolver: req => `/api${url.parse(req.url).path}`,
  }),
);
app.use(
  '/graphql',
  proxy(apiUrl, {
    proxyReqPathResolver: () => '/graphql',
  }),
);

// Always return the main index.html, so react-router render the route in the client
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'public', 'index.html'));
});

module.exports = app;
