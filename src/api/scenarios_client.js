import ApiClient from './api_client';

class ScenariosClient extends ApiClient {
  queryScenarios(xApiKey) {
    const headers = ApiClient.formatHeaders(xApiKey);
    return this.query({
      query: `{
        scenarios {
          status
          projectName
          fullDescription
        }
      }`,
      headers,
    });
  }

  queryScenario(projectName, scenarioName, xApiKey) {
    const headers = ApiClient.formatHeaders(xApiKey);
    return this.query({
      query: `query scenario($projectName: String!, $scenarioName: String!){
        scenario(projectName: $projectName,
                 scenarioName: $scenarioName) {
          name
          projectName
          lastRun
          lastStatus
          lastPassed
          lastFailed
          totalRuns
          totalPassed
          totalFailed
          totalPending
        }
      }`,
      variables: { projectName, scenarioName },
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
