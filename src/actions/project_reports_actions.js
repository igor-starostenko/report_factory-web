import ReportsClient from '../api/reports_client';

export const GET_PROJECT_REPORTS = 'get_reports';
export const GET_PROJECT_RSPEC_REPORTS = 'get_rspec_reports';
export const GET_PROJECT_RSPEC_REPORTS_SUCCESS = 'get_rspec_reports_success';
export const GET_PROJECT_RSPEC_REPORTS_FAILURE = 'get_rspec_reports_failure';
export const GET_PROJECT_RSPEC_REPORT = 'get_rspec_report';
export const SET_PROJECT_RSPEC_REPORTS_PAGE = 'set_project_rspec_reports_page';
export const RESET_PROJECT_RSPEC_REPORTS = 'reset_project_rspec_reports';

const apiUrl = process.env.API_URL;
const reportsClient = new ReportsClient(apiUrl);

export const getProjectReports = (projectName, xApiKey) => {
  const request = reportsClient.getAllProjectReports(projectName, xApiKey);

  return {
    type: GET_PROJECT_REPORTS,
    payload: request.then(response => response.json()),
  };
};

/* eslint-disable arrow-body-style */
export const getProjectRspecReports = (projectName, xApiKey, options) => {
  return reportsClient.getAllProjectRspecReports(projectName, xApiKey, options);
};
/* eslint-enable arrow-body-style */

export const setProjectRspecReportsPage = response => ({
  type: SET_PROJECT_RSPEC_REPORTS_PAGE,
  payload: response.headers,
});

export const getProjectRspecReportsSuccess = response => ({
  type: GET_PROJECT_RSPEC_REPORTS_SUCCESS,
  payload: response.json(),
});

export const getProjectRspecReportsFailure = response => ({
  type: GET_PROJECT_RSPEC_REPORTS_FAILURE,
  payload: response.json(),
});

export const resetProjectRspecReports = () => ({ type: RESET_PROJECT_RSPEC_REPORTS });

export const getRspecReportByProject = (projectName, id, xApiKey) => {
  const request = reportsClient.showProjectRspecReport(projectName, id, xApiKey);

  return {
    type: GET_PROJECT_RSPEC_REPORT,
    payload: request.then(response => response.json()),
  };
};
