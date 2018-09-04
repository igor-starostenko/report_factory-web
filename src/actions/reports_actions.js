import ReportsClient from '../api/reports_client';

export const REPORTS = 'reports';
export const RSPEC_REPORTS = 'rspec_reports';
export const RSPEC_REPORTS_QUERY = 'rspec_reports_query';
export const GET_REPORTS = 'get_reports';
export const GET_RSPEC_REPORT = 'get_rspec_report';
export const RESET_RSPEC_REPORT = 'reset_rspec_reports';
export const GET_RSPEC_REPORTS = 'get_rspec_reports';
export const GET_RSPEC_REPORTS_SUCCESS = 'get_rspec_reports_success';
export const GET_RSPEC_REPORTS_FAILURE = 'get_rspec_reports_failure';
export const SET_RSPEC_REPORTS_PAGE = 'set_rspec_reports_page';
export const SET_RSPEC_REPORTS_TAGS = 'set_rspec_reports_tags';
export const RESET_RSPEC_REPORTS = 'reset_rspec_reports';

const apiUrl = process.env.API_URL;
const reportsClient = new ReportsClient(apiUrl);

export const queryReports = (xApiKey, variables) => {
  const request = reportsClient.queryReports(xApiKey, variables);

  return {
    type: REPORTS,
    payload: request.then(response => response.json()),
  };
};

export const queryRspecReports = (xApiKey, variables) => {
  const request = reportsClient.queryRspecReports(xApiKey, variables);

  return {
    type: RSPEC_REPORTS,
    payload: request.then(response => response.json()),
  };
};

export const setRspecReportsQuery = variables => ({
  type: RSPEC_REPORTS_QUERY,
  payload: variables,
});

export const getReports = (xApiKey, options) => {
  const request = reportsClient.getReports(xApiKey, options);

  return {
    type: GET_REPORTS,
    payload: request.then(response => response.json()),
  };
};

export const getRspecReport = (reportId, xApiKey) => {
  const request = reportsClient.showRspecReport(reportId, xApiKey);

  return {
    type: GET_RSPEC_REPORT,
    payload: request.then(response => response.json()),
  };
};

export const resetRspecReport = () => ({ type: RESET_RSPEC_REPORT });

/* eslint-disable arrow-body-style */
export const getRspecReports = (xApiKey, options) => {
  return reportsClient.getRspecReports(xApiKey, options);
};
/* eslint-enable arrow-body-style */

export const setRspecReportsPage = response => ({
  type: SET_RSPEC_REPORTS_PAGE,
  payload: response.headers,
});

export const setRspecReportsTags = tags => ({
  type: SET_RSPEC_REPORTS_TAGS,
  payload: tags,
});

export const getRspecReportsSuccess = response => ({
  type: GET_RSPEC_REPORTS_SUCCESS,
  payload: response.json(),
});

export const getRspecReportsFailure = response => ({
  type: GET_RSPEC_REPORTS_FAILURE,
  payload: response.json(),
});

export const resetRspecReports = () => ({ type: RESET_RSPEC_REPORTS });
