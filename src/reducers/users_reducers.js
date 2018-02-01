import _ from 'lodash';
import { EDIT_USER, EDIT_USER_SUCCESS, EDIT_USER_FAILURE, RESET_EDIT_USER, GET_USER_REPORTS,
         GET_USER, GET_USERS, LOGIN, LOGIN_SUCCESS, LOGIN_FAILURE, LOGOUT } from '../actions/users_actions';

const INITIAL_STATE = { currentUser: { data: null, error: null, loading: false },
            						activeUser: { data: null, error: null, loading: false },
            						editUser: { data: null, error:null, loading: false },
            						usersList: { data: [], error:null, loading: false } };

export default (state = INITIAL_STATE, action) => {
  let error;
  switch (action.type) {
    case LOGIN:
      return { ...state, currentUser: { ...state.currentUser, loading: true } };
    case LOGIN_SUCCESS:
      return { ...state, currentUser: { data: action.payload.data, error: null, loading: false } };
    case LOGIN_FAILURE:
      error = action.payload.errors;
      return { ...state, currentUser: { data: null, error: error, loading: false} };
    case LOGOUT:
      return { ...state, currentUser: { data: null, error: null, loading: false }};
    case GET_USER_REPORTS:
      return { ...state, userReports: { data: action.payload.data, error: null, loading: false}};
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
