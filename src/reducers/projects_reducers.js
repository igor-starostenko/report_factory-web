import _ from 'lodash';
import { GET_PROJECTS } from '../actions';

export default function (state = {}, action) {
  switch (action.type) {
    case GET_PROJECTS: {
      const { data } = action.payload;
      if (data) {
        return _.mapKeys(data, 'id');
      }
      return action.payload;
    }
    default: {
      return state;
    }
  }
}
