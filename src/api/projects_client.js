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

  queryProject(projectName, xApiKey) {
    const headers = ApiClient.formatHeaders(xApiKey);
    return this.query({
      query: `{
        project(project_name: "${projectName}") {
          project_name
          reports {
            id
            status
            created_at
            updated_at
          }
          scenarios {
            status
            project_name
            full_description
          }
        }
      }`,
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
