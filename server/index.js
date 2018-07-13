// server/index.js
const app = require('./app');

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  /* eslint-disable no-console */
  console.log(`App listening on port ${PORT}!`);
  /* eslint-enable no-console */
});
