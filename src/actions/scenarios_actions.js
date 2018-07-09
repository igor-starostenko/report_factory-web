import ScenariosClient from '../api/scenarios_client';

export const SCENARIOS = 'scenarios';
export const GET_SCENARIOS = 'get_scenarios';
export const GET_PROJECT_SCENARIOS = 'get_project_scenarios';

const apiUrl = process.env.API_URL;
const scenariosClient = new ScenariosClient(apiUrl);

export const queryScenarios = (xApiKey) => {
  const request = scenariosClient.queryScenarios(xApiKey);

  return {
    type: SCENARIOS,
    payload: request.then(response => response.json()),
  }
}

// Deprecated. Use 'queryScenarios' action instead
export const getAllScenarios = (xApiKey) => {
  const request = scenariosClient.getScenarios(xApiKey);

  return {
    type: GET_SCENARIOS,
    payload: request.then(response => response.json()),
  };
};

export const getProjectScenarios = (projectName, xApiKey) => {
  const request = scenariosClient.getAllProjectScenarios(projectName, xApiKey);

  return {
    type: GET_PROJECT_SCENARIOS,
    payload: request.then(response => response.json()),
  };
};
