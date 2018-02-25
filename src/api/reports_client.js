import ApiClient from './api_client';

class ReportsClient extends ApiClient {
  getAllProjectReports(projectName, xApiKey) {
    const url = `${this.baseUrl}api/v1/projects/${projectName}/reports`;
    const headers = ApiClient.formatHeaders(xApiKey);
    return fetch(new Request(url, { method: 'GET', headers }));
  }

  getAllProjectRspecReports(projectName, xApiKey) {
    const url = `${this.baseUrl}api/v1/projects/${projectName}/reports/rspec`;
    const headers = ApiClient.formatHeaders(xApiKey);
    return fetch(new Request(url, { method: 'GET', headers }));
  }

  showProjectRspecReport(projectName, id, xApiKey) {
    const url = `${this.baseUrl}api/v1/projects/${projectName}/reports/rspec/${id}`;
    const headers = ApiClient.formatHeaders(xApiKey);
    return fetch(new Request(url, { method: 'GET', headers }));
  }
}

export default ReportsClient;
