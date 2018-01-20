import _ from 'lodash';
import { GET_RSPEC_REPORTS, GET_RSPEC_REPORT } from '../actions';

export default (state = {}, action) => {
  switch (action.type) {
    case GET_RSPEC_REPORTS: {
      const { data } = action.payload;
      if (data) {
        return _.mapKeys(data, obj => obj.attributes.project_name);
      }
      return action.payload;
    }
    case GET_RSPEC_REPORT: {
      const { data } = action.payload;
      if (data) {
        const name = data.attributes.project_name;
        return { ...state, [name]: action.payload.data };
      }
      return action.payload;
    }
    default: {
      return state;
    }
  }
};
