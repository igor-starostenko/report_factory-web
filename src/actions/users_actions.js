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
export const RESET_EDIT_USER = 'reset_new_user';
export const GET_USERS = 'get_users';
export const GET_USER = 'get_user';

export const GET_USER_REPORTS = 'get_user_reports';

const apiUrl = process.env.API_URL;
const usersClient = new UsersClient(apiUrl);

export const getApiKey = (user) => {
  let xApiKey = Cookies.get('X-API-KEY');
  if (!xApiKey && user) {
    if (user.data) {
      xApiKey = user.data.attributes.api_key;
    }
  }
  return {
    type: API_KEY,
    payload: xApiKey || null,
  };
};

export const authUser = (xApiKey) => {
  const request = usersClient.authUser(xApiKey);

  return {
    type: LOGIN_SUCCESS,
    payload: request.then(response => response.json()),
  };
};

export const signIn = ({ email, password }) => {
  const request = usersClient.loginUser(email, password);

  return {
    type: LOGIN,
    payload: request.then(response => response.json()),
  };
};

export const signInSuccess = (payload) => {
  const xApiKey = payload.data.attributes.api_key;
  Cookies.set('X-API-KEY', xApiKey, { expires: 7 });
  store.dispatch(getApiKey(signIn));

  return {
    type: LOGIN_SUCCESS,
    payload: signIn,
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

export const getUserReports = (userId, xApiKey) => {
  const request = usersClient.getAllUserReports(userId, xApiKey);

  return {
    type: GET_USER_REPORTS,
    payload: request.then(response => response.json()),
  };
};

// api.getAllUsers(testerXApiKey);
// api.createUser('New', 'testerNew@mailinator.com', 'Qwerty12', 'Tester', adminXApiKey);
// api.showUser(1, testerXApiKey);
// api.updateUser(5, 'Update', 'update_5@mailinator.com', 'Qwerty12', 'Tester', adminXApiKey);
// api.deleteUser(8, adminXApiKey);
