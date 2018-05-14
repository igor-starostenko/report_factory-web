import _ from 'lodash';
import { GET_SCENARIOS, GET_PROJECT_SCENARIOS } from '../actions/project_scenarios_actions';

const INITIAL_STATE = {
  scenariosList: { data: {}, error: null, loading: false },
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_SCENARIOS: {
      /* eslint-disable arrow-body-style */
      const projectScenarios = _.mapKeys(action.payload.data, (project) => {
        return project.attributes.project_name;
      });
      /* eslint-enable arrow-body-style */
      const data = _.mapValues(projectScenarios, project => project.attributes.scenarios);
      return { ...state, scenariosList: { data, error: null, loading: false } };
    }
    case GET_PROJECT_SCENARIOS: {
      const { data } = action.payload;
      const projectName = data.attributes.project_name;
      const { scenarios } = data.attributes;
      const scenariosList = _.set(state.scenariosList.data, projectName, scenarios);
      return { ...state, scenariosList: { data: scenariosList, error: null, loading: false } };
    }
    default: {
      return state;
    }
  }
};
