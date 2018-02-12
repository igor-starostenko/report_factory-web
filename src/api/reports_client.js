import ApiClient from './api_client';

class ReportsClient extends ApiClient {
  getAllReports(projectName, xApiKey) {
    const url = `${this.baseUrl}api/v1/projects/${projectName}/reports`;
    const headers = ApiClient.formatHeaders(xApiKey);
    return fetch(new Request(url, { method: 'GET', headers }));
  }

  getAllRspecReports(projectName, xApiKey) {
    const url = `${this.baseUrl}api/v1/projects/${projectName}/reports/rspec`;
    const headers = ApiClient.formatHeaders(xApiKey);
    return fetch(new Request(url, { method: 'GET', headers }));
  }

  showRspecReport(projectName, id, xApiKey) {
    const url = `${this.baseUrl}api/v1/projects/${projectName}/reports/rspec/${id}`;
    const headers = ApiClient.formatHeaders(xApiKey);
    return fetch(new Request(url, { method: 'GET', headers }));
  }
}

export default ReportsClient;
