import ProjectsClient from '../api/projects_client';

export const PROJECT = 'project';
export const PROJECT_FILTERS = 'project_filters';
export const EDIT_PROJECT = 'edit_project';
export const EDIT_PROJECT_SUCCESS = 'create_project_success';
export const EDIT_PROJECT_FAILURE = 'create_project_failure';
export const RESET_EDIT_PROJECT = 'reset_new_project';
export const GET_PROJECTS = 'get_projects';
export const GET_PROJECT = 'get_project';
export const RESET_ACTIVE_PROJECT = 'reset_active_project';

const apiUrl = process.env.API_URL;
const projectsClient = new ProjectsClient(apiUrl);

export const queryProject = (projectName, xApiKey) => {
  const request = projectsClient.queryProject(projectName, xApiKey);

  return {
    type: PROJECT,
    payload: request.then(response => response.json()),
  };
};

export const setProjectFilters = (projectName, filters) => ({
    type: PROJECT_FILTERS,
    payload: { projectName, data: filters },
});

export const getProjects = (xApiKey) => {
  const request = projectsClient.getAllProjects(xApiKey);

  return {
    type: GET_PROJECTS,
    payload: request.then(response => response.json()),
  };
};

export const getProject = (name, xApiKey) => {
  const request = projectsClient.showProject(name, xApiKey);

  return {
    type: GET_PROJECT,
    payload: request.then(response => response.json()),
  };
};

export const resetProject = () => ({ type: RESET_ACTIVE_PROJECT });

export const createProject = (name, xApiKey) => {
  const request = projectsClient.createProject(name, xApiKey);

  return {
    type: EDIT_PROJECT,
    payload: request.then(response => response.json()),
  };
};

export const updateProject = (projectName, newName, xApiKey) => {
  const request = projectsClient.updateProject(projectName, newName, xApiKey);

  return {
    type: EDIT_PROJECT,
    payload: request.then(response => response.json()),
  };
};

export const editProjectSuccess = editProject => ({
  type: EDIT_PROJECT_SUCCESS,
  payload: editProject,
});

export const editProjectFailure = errors => ({
  type: EDIT_PROJECT_FAILURE,
  payload: errors,
});

export const deleteProject = (name, xApiKey) => {
  const request = projectsClient.deleteProject(name, xApiKey);

  return {
    type: EDIT_PROJECT,
    payload: request.then(response => response.json()),
  };
};

export const resetEditProject = () => ({
  type: RESET_EDIT_PROJECT,
});
