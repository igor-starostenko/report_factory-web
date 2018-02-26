import ApiClient from './api_client';

class ReportsClient extends ApiClient {
  getReports(xApiKey, options) {
    const url = `${this.baseUrl}api/v1/reports`;
    const params = this.constructor.formatQuery(options);
    const headers = ApiClient.formatHeaders(xApiKey);
    return fetch(new Request(url + params, { method: 'GET', headers }));
  }

  getRspecReports(xApiKey, options) {
    const url = `${this.baseUrl}api/v1/reports/rspec`;
    const params = this.constructor.formatQuery(options);
    const headers = ApiClient.formatHeaders(xApiKey);
    return fetch(new Request(url + params, { method: 'GET', headers }));
  }

  getAllProjectReports(projectName, xApiKey) {
    const url = `${this.baseUrl}api/v1/projects/${projectName}/reports`;
    const headers = ApiClient.formatHeaders(xApiKey);
    return fetch(new Request(url, { method: 'GET', headers }));
  }

  getAllProjectRspecReports(projectName, xApiKey, options) {
    const url = `${this.baseUrl}api/v1/projects/${projectName}/reports/rspec`;
    const params = this.constructor.formatQuery(options);
    const headers = ApiClient.formatHeaders(xApiKey);
    return fetch(new Request(url + params, { method: 'GET', headers }));
  }

  showProjectRspecReport(projectName, id, xApiKey) {
    const url = `${this.baseUrl}api/v1/projects/${projectName}/reports/rspec/${id}`;
    const headers = ApiClient.formatHeaders(xApiKey);
    return fetch(new Request(url, { method: 'GET', headers }));
  }
}

export default ReportsClient;
