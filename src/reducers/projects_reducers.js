import _ from 'lodash';
import { GET_PROJECT, GET_PROJECTS } from '../actions';

export default (state = {}, action) => {
  switch (action.type) {
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
        console.log(state);
        // console.log({ [name]: action.payload });
        return { [name]: action.payload };
      }
      return action.payload;
    }
    default: {
      return state;
    }
  }
};
