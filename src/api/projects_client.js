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

  showProject(id, xApiKey) {
    const url = `${this.baseUrl}api/v1/projects/${id}`;
    const headers = ApiClient.formatHeaders(xApiKey);
    return fetch(new Request(url, { method: 'GET', headers }));
  }

  updateProject(id, projectName, xApiKey) {
    const url = `${this.baseUrl}api/v1/projects/${id}`;
    const headers = ApiClient.formatHeaders(xApiKey);
    const type = { type: 'project' };
    const attributes = { project_name: projectName };
    const body = ApiClient.formatPayload(type, attributes);
    return fetch(new Request(url, { method: 'PUT', body, headers }));
  }
}

export default ProjectsClient;
