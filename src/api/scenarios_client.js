import ApiClient from './api_client';

class ScenariosClient extends ApiClient {
  queryScenarios(xApiKey) {
    const headers = ApiClient.formatHeaders(xApiKey);
    return this.query({
      query: `{
        scenarios {
          status
          project_name
          full_description
        }
      }`,
      headers,
    });
  }

  queryScenario(projectName, scenarioName, xApiKey) {
    const headers = ApiClient.formatHeaders(xApiKey);
    return this.query({
      query: `{
        scenario(project_name: "${projectName}",
                 scenario_name: "${scenarioName}") {
          name
          project_name
          last_run
          last_status
          last_passed
          last_failed
          total_runs
          total_passed
          total_failed
          total_pending
        }
      }`,
      headers,
    });
  }

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
