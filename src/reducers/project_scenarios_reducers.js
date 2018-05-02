import _ from 'lodash';
import { GET_PROJECT_SCENARIOS } from '../actions/project_scenarios_actions';

const INITIAL_STATE = {
  scenariosList: { data: null, error: null, loading: false },
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_PROJECT_SCENARIOS: {
      const { data } = action.payload;
      if (data[0]) {
        const projectName = data[0].attributes.project_name;
        return { ...state, scenariosList: { [projectName]: _.mapKeys(data, obj => obj.id) } };
      }
      return { ...state };
    }
    default: {
      return state;
    }
  }
};
