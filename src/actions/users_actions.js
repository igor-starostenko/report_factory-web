import Cookies from 'js-cookie';
import store from '../index';

import UsersClient from '../api/users_client';

export const API_KEY = 'api_key';
export const LOGIN = 'login';
export const LOGIN_SUCCESS = 'login_success';
export const LOGIN_FAILURE = 'login_failure';
export const LOGOUT = 'logout';

export const EDIT_USER = 'edit_user';
export const EDIT_USER_SUCCESS = 'create_user_success';
export const EDIT_USER_FAILURE = 'create_user_failure';
export const RESET_EDIT_USER = 'reset_edit_user';
export const GET_USERS = 'get_users';
export const GET_USER = 'get_user';
export const RESET_ACTIVE_USER = 'reset_active_user';

export const GET_USER_REPORTS = 'get_user_reports';
export const USER_REPORTS = 'user_details';
export const USER_REPORTS_FILTERS = 'user_reports_filters';

const apiUrl = process.env.API_URL;
const usersClient = new UsersClient(apiUrl);

export const setApiKey = xApiKey => ({ type: API_KEY, payload: xApiKey });

export const authUser = xApiKey => {
  const request = usersClient.authUser(xApiKey);

  return {
    type: LOGIN,
    payload: request,
  };
};

export const authSuccess = request => ({
  type: LOGIN_SUCCESS,
  payload: request.json(),
});

export const authFailure = request => ({
  type: LOGIN_FAILURE,
  payload: request.json ? request.json() : request,
});

export const signIn = ({ email, password }) => {
  const request = usersClient.loginUser(email, password);

  return {
    type: LOGIN,
    payload: request.then(response => response.json()),
  };
};

export const signInSuccess = payload => {
  const xApiKey = payload.data.attributes.api_key;
  Cookies.set('X-API-KEY', xApiKey, { expires: 7 });
  store.dispatch(setApiKey(xApiKey));

  return {
    type: LOGIN_SUCCESS,
    payload,
  };
};

export const signInFailure = errors => ({
  type: LOGIN_FAILURE,
  payload: errors,
});

export const logOut = () => {
  Cookies.remove('X-API-KEY');

  return {
    type: LOGOUT,
  };
};

export const queryUserReports = (xApiKey, filters) => {
  const request = usersClient.queryUserReports(xApiKey, filters);

  return {
    type: USER_REPORTS,
    payload: request.then(response => response.json()),
  };
};

export const setUserReportsFilters = (userId, filters) => ({
  type: USER_REPORTS_FILTERS,
  payload: { userId, data: filters },
});

export const getUserReports = (userId, xApiKey) => {
  const request = usersClient.getAllUserReports(userId, xApiKey);

  return {
    type: GET_USER_REPORTS,
    payload: request.then(response => response.json()),
  };
};

export const getUsers = xApiKey => {
  const request = usersClient.getAllUsers(xApiKey);

  return {
    type: GET_USERS,
    payload: request.then(response => response.json()),
  };
};

export const getUser = (userId, xApiKey) => {
  const request = usersClient.showUser(userId, xApiKey);

  return {
    type: GET_USER,
    payload: request.then(response => response.json()),
  };
};

export const resetUser = () => ({ type: RESET_ACTIVE_USER });

export const createUser = (attributes, xApiKey) => {
  const request = usersClient.createUser(attributes, xApiKey);

  return {
    type: EDIT_USER,
    payload: request.then(response => response.json()),
  };
};

export const resetEditUser = () => ({ type: RESET_EDIT_USER });

export const updateUser = (userId, attributes, xApiKey) => {
  const request = usersClient.updateUser(userId, attributes, xApiKey);

  return {
    type: EDIT_USER,
    payload: request.then(response => response.json()),
  };
};

export const editUserSuccess = editUser => ({
  type: EDIT_USER_SUCCESS,
  payload: editUser,
});

export const editUserFailure = errors => ({
  type: EDIT_USER_FAILURE,
  payload: errors,
});

export const deleteUser = (userId, xApiKey) => {
  const request = usersClient.deleteUser(userId, xApiKey);

  return {
    type: EDIT_USER,
    payload: request.then(response => response.json()),
  };
};
