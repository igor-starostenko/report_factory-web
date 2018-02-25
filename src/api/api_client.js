import ApiHelper from './api_helper';

class ApiClient {
  constructor(url) {
    ApiHelper.verifyUrl(url);
    this.baseUrl = ApiHelper.formatUrl(url);
  }

  static formatQuery(options) {
    if (!options || Object.keys(options).length === 0) {
      return '';
    }
    /* eslint-disable arrow-body-style */
    const paramsArr = Object.keys(options).map((key) => {
      return `${encodeURIComponent(key)}=${encodeURIComponent(options[key])}`;
    });
    /* eslint-enable arrow-body-style */
    return `?${paramsArr.join('&')}`;
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
