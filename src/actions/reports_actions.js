import ReportsClient from '../api/reports_client';

export const GET_REPORTS = 'get_reports';
export const GET_RSPEC_REPORTS = 'get_rspec_reports';
export const GET_RSPEC_REPORT = 'get_rspec_report';

const apiUrl = process.env.API_URL;
const reportsClient = new ReportsClient(apiUrl);

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
