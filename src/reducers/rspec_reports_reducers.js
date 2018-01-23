import _ from 'lodash';
import { GET_RSPEC_REPORTS, GET_RSPEC_REPORT } from '../actions';

export default (state = {}, action) => {
  switch (action.type) {
    case GET_RSPEC_REPORTS: {
      const { data } = action.payload;
      if (data[0]) {
        const projectName = data[0].attributes.project_name;
        return { ...state, [projectName]: _.mapKeys(data, obj => obj.id) };
      }
      return action.payload;
    }
    case GET_RSPEC_REPORT: {
      const { data } = action.payload;
      if (data) {
        const projectName = data.attributes.project_name;
        return { ...state, [projectName]: { [data.id]: data } };
      }
      return action.payload;
    }
    default: {
      return state;
    }
  }
};
