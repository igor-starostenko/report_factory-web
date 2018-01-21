import _ from 'lodash';
import { GET_REPORTS } from '../actions';

export default (state = {}, action) => {
  switch (action.type) {
    case GET_REPORTS: {
      const { data } = action.payload;
      if (data) {
        const projectName = data[0].attributes.project_name;
        return { ...state, [projectName]: _.mapKeys(data, obj => obj.id) };
      }
      return action.payload;
    }
    default: {
      return state;
    }
  }
};
