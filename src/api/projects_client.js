import ApiClient from './api_client';

class ProjectsClient extends ApiClient {
  getAllProjects(xApiKey) {
    const url = `${this.baseUrl}api/v1/projects`;
    const headers = ApiClient.formatHeaders(xApiKey);
    return fetch(new Request(url, { method: 'GET', headers }));
  }

  createProject(projectName, xApiKey) {
    const url = `${this.baseUrl}api/v1/projects`;
    const headers = ApiClient.formatHeaders(xApiKey);
    const type = { type: 'project' };
    const attributes = { project_name: projectName };
    const body = ApiClient.formatPayload(type, attributes);
    return fetch(new Request(url, { method: 'POST', body, headers }));
  }

  queryProject(xApiKey, { projectName, lastDays, lastMonths } = {}) {
    const headers = ApiClient.formatHeaders(xApiKey);
    return this.query({
      query: `query project($projectName: String!, $lastDays: Int, $lastMonths: Int){
        project(projectName: $projectName) {
          projectName
          reportsCount
          reports(lastDays: $lastDays, lastMonths: $lastMonths) {
            status
            createdAt
            updatedAt
          }
          scenarios(lastDays: $lastDays, lastMonths: $lastMonths) {
            status
            projectName
            fullDescription
          }
        }
      }`,
      variables: { projectName, lastDays, lastMonths },
      headers,
    });
  }

  showProject(projectName, xApiKey) {
    const url = `${this.baseUrl}api/v1/projects/${projectName}`;
    const headers = ApiClient.formatHeaders(xApiKey);
    return fetch(new Request(url, { method: 'GET', headers }));
  }

  updateProject(projectName, newName, xApiKey) {
    const url = `${this.baseUrl}api/v1/projects/${projectName}`;
    const headers = ApiClient.formatHeaders(xApiKey);
    const type = { type: 'project' };
    const attributes = { project_name: newName };
    const body = ApiClient.formatPayload(type, attributes);
    return fetch(new Request(url, { method: 'PUT', body, headers }));
  }

  deleteProject(projectName, xApiKey) {
    const url = `${this.baseUrl}api/v1/projects/${projectName}`;
    const headers = ApiClient.formatHeaders(xApiKey);
    return fetch(new Request(url, { method: 'DELETE', headers }));
  }
}

export default ProjectsClient;
