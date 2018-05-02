import ScenariosClient from '../api/scenarios_client';

export const GET_PROJECT_SCENARIOS = 'get_project_scenarios';

const apiUrl = process.env.API_URL;
const scenariosClient = new ScenariosClient(apiUrl);

export const getProjectScenarios = (projectName, xApiKey) => {
  const request = scenariosClient.getAllProjectScenarios(projectName, xApiKey);

  return {
    type: GET_PROJECT_SCENARIOS,
    payload: request.then(response => response.json()),
  };
};
