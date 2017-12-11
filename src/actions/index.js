import Cookies from 'js-cookie';
// import { store } from '../index';

import UsersClient from '../api/users_client';
import ProjectsClient from '../api/projects_client';

export const LOGIN = 'login';
export const GET_PROJECTS = 'get_projects';

const apiUrl = process.env.API_URL;
const usersClient = new UsersClient(apiUrl);
const projectsClient = new ProjectsClient(apiUrl);
// const adminXApiKey = 'b6922679-446e-4e12-8d4f-26cface97a02';
// const testerXApiKey = '9e04136f-c71d-4d16-924a-216e9af08903';

// export const signIn = createAction(LOGIN, async id => {
//  return await completeSignIn(email, password);
// });

export function signIn({ email, password }) {
  const response = usersClient.loginUser(email, password)
    .then(res => res.json());
  response.then((res) => {
    const xApiKey = res.data.attributes.api_key;
    Cookies.set('X-API-KEY', xApiKey, { expires: 7 });
    //    store.dispatch({ type: LOGIN, payload: res });
  });

  return {
    type: LOGIN,
    payload: response,
  };
}

export function getProjects(xApiKey) {
  const request = projectsClient.getAllProjects(xApiKey);

  return {
    type: GET_PROJECTS,
    payload: request.then(response => response.json()),
  };
}


// api.getAllUsers(testerXApiKey);
// api.loginUser('tester@mailinator.com', 'Qwerty12');
// api.createUser('New', 'testerNew@mailinator.com', 'Qwerty12', 'Tester', adminXApiKey);
// api.showUser(1, testerXApiKey);
// api.updateUser(5, 'Update', 'update_5@mailinator.com', 'Qwerty12', 'Tester', adminXApiKey);
// api.deleteUser(8, adminXApiKey);
// api.getAllUserReports(1, testerXApiKey);
