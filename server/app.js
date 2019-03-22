// server/app.js
const express = require('express');
const morgan = require('morgan');
const path = require('path');
const proxy = require('express-http-proxy');
const url = require('url');

const app = express();

function getApiUrl() {
  const apiUrl = process.env.API_URL;
  if (apiUrl) {
    return apiUrl;
  }
  throw new Error('API_URL is not set');
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
  proxy(getApiUrl(), {
    proxyReqPathResolver: req => `/api${url.parse(req.url).path}`,
  }),
);
app.use(
  '/graphql',
  proxy(getApiUrl(), {
    proxyReqPathResolver: () => '/graphql',
  }),
);

// Always return the main index.html, so react-router render the route in the client
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'public', 'index.html'));
});

module.exports = app;
