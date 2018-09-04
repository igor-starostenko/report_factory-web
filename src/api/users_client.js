import ApiClient from './api_client';

class UsersClient extends ApiClient {
  queryUserReports(userId, xApiKey) {
    const headers = ApiClient.formatHeaders(xApiKey);
    return this.query({
      query: `query user($id: Int!){
        user(id: $id) {
          id
          name
          reports {
            projectName
            createdAt
          }
        }
      }`,
      variables: { id: parseInt(userId) },
      headers,
    });
  }

  getAllUsers(xApiKey) {
    const url = `${this.baseUrl}api/v1/users`;
    const headers = ApiClient.formatHeaders(xApiKey);
    return fetch(new Request(url, { method: 'GET', headers }));
  }

  authUser(xApiKey) {
    const url = `${this.baseUrl}api/v1/user`;
    const headers = ApiClient.formatHeaders(xApiKey);
    return fetch(new Request(url, { method: 'GET', headers }));
  }

  loginUser(email, password) {
    const url = `${this.baseUrl}api/v1/users/login`;
    const headers = ApiClient.formatHeaders();
    const attributes = { email, password };
    const body = ApiClient.formatPayload('user', attributes);
    return fetch(new Request(url, { method: 'POST', body, headers }));
  }

  createUser(attributes, xApiKey) {
    const url = `${this.baseUrl}api/v1/users/create`;
    const headers = ApiClient.formatHeaders(xApiKey);
    /* eslint no-param-reassign: ["error", { "props": false }] */
    attributes.type = attributes.type || 'Tester';
    const body = ApiClient.formatPayload('user', attributes);
    return fetch(new Request(url, { method: 'POST', body, headers }));
  }

  showUser(id, xApiKey) {
    const url = `${this.baseUrl}api/v1/users/${id}`;
    const headers = ApiClient.formatHeaders(xApiKey);
    return fetch(new Request(url, { method: 'GET', headers }));
  }

  updateUser(id, attributes, xApiKey) {
    const url = `${this.baseUrl}api/v1/users/${id}`;
    const headers = ApiClient.formatHeaders(xApiKey);
    const body = ApiClient.formatPayload('user', attributes);
    return fetch(new Request(url, { method: 'PUT', body, headers }));
  }

  deleteUser(id, xApiKey) {
    const url = `${this.baseUrl}api/v1/users/${id}`;
    const headers = ApiClient.formatHeaders(xApiKey);
    return fetch(new Request(url, { method: 'DELETE', headers }));
  }

  getAllUserReports(id, xApiKey) {
    const url = `${this.baseUrl}api/v1/users/${id}/reports`;
    const headers = ApiClient.formatHeaders(xApiKey);
    return fetch(new Request(url, { method: 'GET', headers }));
  }
}

export default UsersClient;
