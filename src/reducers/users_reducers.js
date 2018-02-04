import _ from 'lodash';
import { EDIT_USER, EDIT_USER_SUCCESS, EDIT_USER_FAILURE, RESET_EDIT_USER, GET_USER_REPORTS,
         GET_USER, GET_USERS, LOGIN, LOGIN_SUCCESS, LOGIN_FAILURE, LOGOUT, API_KEY } from '../actions/users_actions';

const INITIAL_STATE = { currentUser: { data: null, error: null, loading: false, xApiKey: null },
            						activeUser: { data: null, error: null, loading: false },
            						userReports: { data: null, error: null, loading: false },
            						editUser: { data: null, error:null, loading: false },
            						usersList: { data: [], error:null, loading: false } };

export default (state = INITIAL_STATE, action) => {
  let error;
  switch (action.type) {
    case API_KEY:
      return { ...state, currentUser: { data: state.currentUser.data, loading: false, xApiKey: action.payload } };
    case LOGIN:
      return { ...state, currentUser: { data: state.currentUser.data, loading: true, xApiKey: null } };
    case LOGIN_SUCCESS:
      const xApiKey = _.get(action.payload, 'data.attributes.api_key') || state.currentUser.xApiKey;
      return { ...state, currentUser: { data: action.payload.data, error: null, loading: false, xApiKey: xApiKey } };
    case LOGIN_FAILURE:
      error = action.payload.errors;
      return { ...state, currentUser: { data: null, error: error, loading: false, xApiKey: null } };
    case LOGOUT:
      return { ...state, currentUser: { data: null, error: null, loading: false, xApiKey: null }};
    case GET_USER_REPORTS:
      const userId = _.get(_.last(action.payload.data), 'attributes.user_id');
      if (userId) {
        const data = _.set(state.userReports.data || {}, userId, action.payload.data);
        return { ...state, userReports: { data: data, error: null, loading: false } };
      }
      return { ...state, userReports: { data: {}, error: true, loading: false } };
    case GET_USERS:
      const list = _.mapKeys(action.payload.data, obj => obj.id);
      return { ...state, usersList: { data: list, error: null, loading: false} };
    case GET_USER:
      return { ...state, activeUser: { data: action.payload.data, error: null, loading: false } };
    case EDIT_USER:
      return { ...state, editUser: { ...state.newUser, loading: true } };
    case EDIT_USER_SUCCESS:
      return { ...state, editUser: { data: action.payload.data, error: null, loading: false } };
    case EDIT_USER_FAILURE:
      error = action.payload.errors;
      return { ...state, editUser: { data: null, error: error, loading: false} };
    case RESET_EDIT_USER:
    	return { ...state, editUser: { data: null, error: null, loading: false} };
    default: {
      return state;
    }
  }
};
