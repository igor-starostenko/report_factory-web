import _ from 'lodash';
import {
  EDIT_USER,
  EDIT_USER_SUCCESS,
  EDIT_USER_FAILURE,
  RESET_EDIT_USER,
  GET_USER_REPORTS,
  GET_USER,
  GET_USERS,
  RESET_ACTIVE_USER,
  LOGIN,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT,
  API_KEY,
  USER_REPORTS,
  USER_REPORTS_FILTERS,
} from '../actions/users_actions';

/* eslint-disable object-curly-newline */
const INITIAL_STATE = {
  currentUser: { data: null, error: null, loading: false, xApiKey: null },
  activeUser: { data: null, error: null, loading: false },
  userReports: { data: {}, error: null, loading: false },
  filters: {}, // Query params for userReports
  editUser: { data: null, error: null, loading: false },
  usersList: { data: null, error: null, loading: false },
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case API_KEY: {
      const { data } = state.currentUser;
      return {
        ...state,
        currentUser: { data, loading: false, xApiKey: action.payload },
      };
    }
    case LOGIN: {
      const { data, xApiKey } = state.currentUser;
      return { ...state, currentUser: { data, loading: true, xApiKey } };
    }
    case LOGIN_SUCCESS: {
      const { data } = action.payload;
      const { xApiKey } = state.currentUser;
      return {
        ...state,
        currentUser: { data, error: null, loading: false, xApiKey },
      };
    }
    case LOGIN_FAILURE: {
      const error = action.payload.errors;
      return {
        ...state,
        currentUser: { data: null, error, loading: false, xApiKey: null },
      };
    }
    case LOGOUT: {
      return {
        ...state,
        currentUser: { data: null, error: null, loading: false, xApiKey: null },
      };
    }
    case USER_REPORTS: {
      const { id, reports, reportsCount } = action.payload.data.user;
      const data = {
        ...state.userReports.data,
        [id]: { reports, reportsCount },
      };
      return { ...state, userReports: { data } };
    }
    case USER_REPORTS_FILTERS: {
      const { userId, data } = action.payload;
      const filters = { ...state.filters, [userId]: data };
      return { ...state, filters };
    }
    // Deprecated in favor of USER_REPORTS graphql
    case GET_USER_REPORTS: {
      const userId = _.get(_.last(action.payload.data), 'attributes.user_id');
      if (userId) {
        const data = _.set(
          state.userReports.data || {},
          userId,
          action.payload.data,
        );
        return { ...state, userReports: { data, error: null, loading: false } };
      }
      return {
        ...state,
        userReports: { data: {}, error: true, loading: false },
      };
    }
    case GET_USERS: {
      const data = _.mapKeys(action.payload.data, obj => obj.id);
      return { ...state, usersList: { data, error: null, loading: false } };
    }
    case GET_USER: {
      return {
        ...state,
        activeUser: { data: action.payload.data, error: null, loading: false },
      };
    }
    case RESET_ACTIVE_USER: {
      return {
        ...state,
        activeUser: { data: null, error: null, loading: false },
      };
    }
    case EDIT_USER: {
      return { ...state, editUser: { ...state.newUser, loading: true } };
    }
    case EDIT_USER_SUCCESS: {
      const userId = _.get(action.payload.data, 'id');
      if (userId) {
        const data = _.set(state.usersList.data, userId, action.payload.data);
        const editUser = {
          data: action.payload.data,
          error: null,
          loading: false,
        };
        const activeUser = editUser;
        return {
          ...state,
          editUser,
          activeUser,
          usersList: { data, error: null, loading: false },
        };
      }
      return {
        ...state,
        editUser: { data: null, error: null, loading: false },
      };
    }
    case EDIT_USER_FAILURE: {
      const error = action.payload.errors;
      return { ...state, editUser: { data: null, error, loading: false } };
    }
    case RESET_EDIT_USER: {
      return {
        ...state,
        editUser: { data: null, error: null, loading: false },
      };
    }
    default: {
      return state;
    }
  }
};
