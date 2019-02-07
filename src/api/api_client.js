import _ from 'lodash';
import ApiHelper from './api_helper';

class ApiClient {
  constructor(url) {
    // ApiHelper.verifyUrl(url);
    this.baseUrl = ApiHelper.formatUrl(url);
    this.graphqlUrl = `${this.baseUrl}graphql`;
  }

  query({ query, variables, headers }) {
    const body = JSON.stringify({ query, variables });
    return fetch(new Request(this.graphqlUrl, { method: 'POST', body, headers }));
  }

  static formatQuery(options) {
    const params = Object.keys(options);
    if (!options || params.length === 0) {
      return '';
    }
    let arrayParams = [];
    /* eslint-disable arrow-body-style */
    const paramsArr = params.map((key) => {
      const value = options[key];
      if (!value || value === []) {
        return null;
      } if (typeof value === 'object') {
        arrayParams = _.union(arrayParams, _.map(value, (paramValue) => {
          return `${encodeURIComponent(key)}[]=${encodeURIComponent(paramValue)}`;
        }));
        return null;
      }
      return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
    });
    paramsArr.push(...arrayParams);
    /* eslint-enable arrow-body-style */
    return `?${paramsArr.filter(n => n).join('&')}`;
  }

  static formatPayload(type, attributes) {
    return JSON.stringify({ data: { type, attributes } });
  }

  static formatHeaders(xApiKey = null) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    if (xApiKey) {
      headers.append('X-API-KEY', xApiKey);
    }
    return headers;
  }
}

export default ApiClient;
