import ApiClient from './api_client';

class ScenariosClient extends ApiClient {
  getScenarios(xApiKey) {
    const url = `${this.baseUrl}api/v1/scenarios`;
    const headers = ApiClient.formatHeaders(xApiKey);
    return fetch(new Request(url, { method: 'GET', headers }));
  }

  getAllProjectScenarios(projectName, xApiKey) {
    const url = `${this.baseUrl}api/v1/projects/${projectName}/scenarios`;
    const headers = ApiClient.formatHeaders(xApiKey);
    return fetch(new Request(url, { method: 'GET', headers }));
  }
}

export default ScenariosClient;
