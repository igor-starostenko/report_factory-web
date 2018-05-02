import _ from 'lodash';
import { GET_PROJECT_SCENARIOS } from '../actions/project_scenarios_actions';

const INITIAL_STATE = {
  scenariosList: { data: {}, error: null, loading: false },
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_PROJECT_SCENARIOS: {
      const { data } = action.payload;
      const projectName = data.attributes.project_name;
      const scenarios = data.attributes.scenarios;
      const scenariosList = _.set(state.scenariosList.data, projectName, scenarios);
      return { ...state, scenariosList: { data: scenariosList, error: null, loading: false } };
    }
    default: {
      return state;
    }
  }
};
