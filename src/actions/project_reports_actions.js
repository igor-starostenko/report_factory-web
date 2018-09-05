import ReportsClient from '../api/reports_client';

export const GET_PROJECT_REPORTS = 'get_project_reports';
export const GET_PROJECT_REPORTS_SUCCESS = 'get_project_reports_success';
export const GET_PROJECT_REPORTS_FAILURE = 'get_project_reports_failure';
export const GET_PROJECT_RSPEC_REPORTS = 'get_project_rspec_reports';
export const GET_PROJECT_RSPEC_REPORTS_SUCCESS = 'get_project_rspec_reports_success';
export const GET_PROJECT_RSPEC_REPORTS_FAILURE = 'get_project_rspec_reports_failure';
export const GET_PROJECT_RSPEC_REPORT = 'get_project_rspec_report';
export const SET_PROJECT_RSPEC_REPORTS_PAGE = 'set_project_rspec_reports_page';
export const SET_PROJECT_RSPEC_REPORTS_TAGS = 'set_project_rspec_reports_tags';
export const RESET_PROJECT_RSPEC_REPORTS = 'reset_project_rspec_reports';
export const PROJECT_RSPEC_REPORTS = 'project_rspec_reports';
export const PROJECT_RSPEC_REPORTS_QUERY = 'project_rspec_reports_query';

const apiUrl = process.env.API_URL;
const reportsClient = new ReportsClient(apiUrl);

export const queryProjectRspecReports = (xApiKey, variables) => {
  const request = reportsClient.queryRspecReports(xApiKey, variables);

  return {
    type: PROJECT_RSPEC_REPORTS,
    payload: request.then(response => response.json()),
  };
};

export const setProjectRspecReportsQuery = variables => ({
  type: PROJECT_RSPEC_REPORTS_QUERY,
  payload: variables,
});

/* eslint-disable arrow-body-style */
export const getProjectReports = (projectName, xApiKey) => {
  return reportsClient.getAllProjectReports(projectName, xApiKey);
};
/* eslint-enable arrow-body-style */

export const setProjectReportsName = projectName => ({
  type: GET_PROJECT_REPORTS,
  payload: { projectName },
});

export const getProjectReportsSuccess = response => ({
  type: GET_PROJECT_REPORTS_SUCCESS,
  payload: response.json(),
});

export const getProjectReportsFailure = response => ({
  type: GET_PROJECT_REPORTS_FAILURE,
  payload: response.payload.json(),
});

/* eslint-disable arrow-body-style */
export const getProjectRspecReports = (projectName, xApiKey, options) => {
  return reportsClient.getAllProjectRspecReports(projectName, xApiKey, options);
};
/* eslint-enable arrow-body-style */

export const setProjectRspecReportsPage = response => ({
  type: SET_PROJECT_RSPEC_REPORTS_PAGE,
  payload: response.headers,
});

export const setProjectRspecReportsTags = tags => ({
  type: SET_PROJECT_RSPEC_REPORTS_TAGS,
  payload: tags,
});

export const getProjectRspecReportsSuccess = response => ({
  type: GET_PROJECT_RSPEC_REPORTS_SUCCESS,
  payload: response.json(),
});

export const getProjectRspecReportsFailure = response => ({
  type: GET_PROJECT_RSPEC_REPORTS_FAILURE,
  payload: response.payload.json(),
});

export const resetProjectRspecReports = () => ({ type: RESET_PROJECT_RSPEC_REPORTS });

export const getRspecReportByProject = (projectName, id, xApiKey) => {
  const request = reportsClient.showProjectRspecReport(projectName, id, xApiKey);

  return {
    type: GET_PROJECT_RSPEC_REPORT,
    payload: request.then(response => response.json()),
  };
};
