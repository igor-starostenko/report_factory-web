import ApiClient from './api_client';

class UsersClient extends ApiClient {
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

  createUser(name, email, password, type = 'Tester', xApiKey) {
    const url = `${this.baseUrl}api/v1/users/create`;
    const headers = ApiClient.formatHeaders(xApiKey);
    const attributes = {
      name, email, password, type,
    };
    const body = ApiClient.formatPayload(type, attributes);
    return fetch(new Request(url, { method: 'POST', body, headers }));
  }

  showUser(id, xApiKey) {
    const url = `${this.baseUrl}api/v1/users/${id}`;
    const headers = ApiClient.formatHeaders(xApiKey);
    return fetch(new Request(url, { method: 'GET', headers }));
  }

  updateUser(id, name, email, password, type = 'Tester', xApiKey) {
    const url = `${this.baseUrl}api/v1/users/${id}`;
    const headers = ApiClient.formatHeaders(xApiKey);
    const attributes = {
      name, email, password, type,
    };
    const body = ApiClient.formatPayload(type, attributes);
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
