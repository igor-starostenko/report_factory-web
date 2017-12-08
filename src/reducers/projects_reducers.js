import _ from 'lodash';
import { GET_PROJECTS } from '../actions';

export default function (state = {}, action) {
  switch (action.type) {
    case GET_PROJECTS:
      return _.mapKeys(action.payload.data, 'id');
    default:
      return state;
  }
}
