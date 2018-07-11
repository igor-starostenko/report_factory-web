import _ from 'lodash';
import { SCENARIOS, SCENARIO, GET_SCENARIOS, GET_PROJECT_SCENARIOS } from '../actions/scenarios_actions';

const INITIAL_STATE = {
  list: { data: [], error: null, loading: true },
  byProject: { data: {}, error: null, loading: true },
  details: { data: {}, error: null, loading: false },
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SCENARIOS: {
      const data = action.payload.data.scenarios;
      const projectScenarios = _.groupBy(data, scenario => scenario.project_name);
      const byProjectData = _.mapValues(projectScenarios, (project) => {
        return { scenarios: project, total_count: project.length };
      });
      const dataObject = (data) => ({ data, error: null, loading: false });
      return { ...state, list: dataObject(data), byProject: dataObject(byProjectData) };
    }
    case SCENARIO: {
      const { scenario } = action.payload.data;
      const projectName = scenario.project_name;
      const project = { ...state.details.data[projectName], [scenario.name]: scenario };
      const data = { ...state.details.data, [projectName]: project };
      return { ...state, details: { data, error: null, loading: false } }
    }
    case GET_SCENARIOS: {
      /* eslint-disable arrow-body-style */
      const projectScenarios = _.mapKeys(action.payload.data, (project) => {
        return project.attributes.project_name;
      });
      /* eslint-enable arrow-body-style */
      const data = _.mapValues(projectScenarios, project => project.attributes.scenarios);
      return { ...state, list: { data, error: null, loading: false } };
    }
    case GET_PROJECT_SCENARIOS: {
      const { data } = action.payload;
      const projectName = data.attributes.project_name;
      const { scenarios } = data.attributes;
      const scenariosList = _.set(state.list.data, projectName, scenarios);
      return { ...state, list: { data: scenariosList, error: null, loading: false } };
    }
    default: {
      return state;
    }
  }
};
