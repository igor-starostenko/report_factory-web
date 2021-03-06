# Report Factory Web

[![Build Status](https://travis-ci.org/igor-starostenko/report_factory-web.svg?branch=master)](https://travis-ci.org/igor-starostenko/report_factory-web)
[![Maintainability](https://api.codeclimate.com/v1/badges/95b1c18ccfc9bf199709/maintainability)](https://codeclimate.com/github/igor-starostenko/report_factory-web/maintainability)

*Report Factory Web* is a dashboard that provides a web interface for [Report Factory](https://github.com/igor-starostenko/report_factory) server and allows user to set up projects, do user management and view reports details and analytics.

## Getting Started
Follow these [instructions](https://github.com/igor-starostenko/report_factory/blob/master/setup/INSTRUCTIONS.md) to get *Report Factory* running with *Docker*. The configuration is ready for production.

The image of this project can be pulled from [Dockerhub](https://hub.docker.com/r/reportfactory/web/):

```bash
  docker pull reportfactory/web
```
## Preconditions

- Start [Report Factory server](https://github.com/igor-starostenko/report_factory);

## Development

Start Webpack server:

```bash
  npm run dev
```

Run Cypress tests:

```bash
  npm run cypress-open
```

## License

The application is available as open source under the terms of the [MIT License](https://opensource.org/licenses/MIT).
