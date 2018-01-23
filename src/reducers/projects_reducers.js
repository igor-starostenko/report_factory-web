import _ from 'lodash';
import { CREATE_PROJECT, GET_PROJECT, GET_PROJECTS } from '../actions';

export default (state = {}, action) => {
  switch (action.type) {
    case CREATE_PROJECT: {
      const { data } = action.payload;
      if (data) {
        const name = data.attributes.project_name;
        return { ...state, [name]: action.payload.data };
      }
      return action.payload;
    }
    case GET_PROJECTS: {
      const { data } = action.payload;
      if (data) {
        return _.mapKeys(data, obj => obj.attributes.project_name);
      }
      return action.payload;
    }
    case GET_PROJECT: {
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
