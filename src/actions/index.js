import Cookies from 'js-cookie';
// import store from '../index';

import ProjectsClient from '../api/projects_client';
import ReportsClient from '../api/reports_client';
import UsersClient from '../api/users_client';

export const API_KEY = 'api_key';
export const LOGIN = 'login';

export const EDIT_PROJECT = 'edit_project';
export const EDIT_PROJECT_SUCCESS = 'create_project_success';
export const EDIT_PROJECT_FAILURE = 'create_project_failure';
export const RESET_EDIT_PROJECT = 'reset_new_project';
export const GET_PROJECTS = 'get_projects';
export const GET_PROJECT = 'get_project';

export const GET_REPORTS = 'get_reports';
export const GET_RSPEC_REPORTS = 'get_rspec_reports';
export const GET_RSPEC_REPORT = 'get_rspec_report';

export const EDIT_USER = 'edit_user';
export const EDIT_USER_SUCCESS = 'create_user_success';
export const EDIT_USER_FAILURE = 'create_user_failure';
export const RESET_EDIT_USER = 'reset_new_user';
export const GET_USERS = 'get_users';
export const GET_USER = 'get_user';

const apiUrl = process.env.API_URL;
const projectsClient = new ProjectsClient(apiUrl);
const reportsClient = new ReportsClient(apiUrl);
const usersClient = new UsersClient(apiUrl);
// const adminXApiKey = 'b6922679-446e-4e12-8d4f-26cface97a02';
// const testerXApiKey = '9e04136f-c71d-4d16-924a-216e9af08903';

export const getApiKey = user => {
  let xApiKey = Cookies.get('X-API-KEY');
  if (!xApiKey && user) {
    if (user.data) {
      xApiKey = user.data.attributes.api_key;
    }
  }
  return {
    type: API_KEY,
    xApiKey: xApiKey || null,
  };
};

export const authUser =  xApiKey => {
  const request = usersClient.authUser(xApiKey);

  return {
    type: LOGIN,
    payload: request.then(response => response.json()),
  };
};

export const signIn = ({ email, password }) => {
  const request = usersClient.loginUser(email, password);

  return {
    type: LOGIN,
    payload: request.then(response => response.json()),
  };
};

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

export const createProject = (name, xApiKey) => {
  const request = projectsClient.createProject(name, xApiKey);

  return {
    type: EDIT_PROJECT,
    payload: request.then(response => response.json()),
  }
}

export const updateProject = (projectName, newName, xApiKey) => {
  const request = projectsClient.updateProject(projectName, newName, xApiKey);

  return {
    type: EDIT_PROJECT,
    payload: request.then(response => response.json()),
  }
}

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
  }
}

export const resetEditProject = () => ({
  type: RESET_EDIT_PROJECT,
});

export const getReports = (projectName, xApiKey) => {
  const request = reportsClient.getAllReports(projectName, xApiKey);

  return {
    type: GET_REPORTS,
    payload: request.then(response => response.json()),
  };
};

export const getRspecReports = (projectName, xApiKey) => {
  const request = reportsClient.getAllRspecReports(projectName, xApiKey);

  return {
    type: GET_RSPEC_REPORTS,
    payload: request.then(response => response.json()),
  };
};

export const getRspecReport = (projectName, id, xApiKey) => {
  const request = reportsClient.showRspecReport(projectName, id, xApiKey);

  return {
    type: GET_RSPEC_REPORT,
    payload: request.then(response => response.json()),
  };
};

// api.getAllUsers(testerXApiKey);
// api.createUser('New', 'testerNew@mailinator.com', 'Qwerty12', 'Tester', adminXApiKey);
// api.showUser(1, testerXApiKey);
// api.updateUser(5, 'Update', 'update_5@mailinator.com', 'Qwerty12', 'Tester', adminXApiKey);
// api.deleteUser(8, adminXApiKey);
// api.getAllUserReports(1, testerXApiKey);
