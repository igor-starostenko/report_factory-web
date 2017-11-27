import ApiClient from './api_client';

export class UsersClient extends ApiClient {
  getAllUsers(xApiKey) {
    const url = `${this.baseUrl}api/v1/users`;
    const headers = ApiClient.formatHeaders(xApiKey);
    const request = new Request(url, { method: 'GET', headers });
    return ApiClient.processRequest(request);
  }

  loginUser(email, password) {
    const url = `${this.baseUrl}api/v1/users/login`;
    const headers = ApiClient.formatHeaders();
    const attributes = { email, password };
    const body = ApiClient.formatPayload('user', attributes);
    const request = new Request(url, { method: 'POST', body, headers });
    return ApiClient.processRequest(request);
  }

  createUser(name, email, password, type = 'Tester', xApiKey) {
    const url = `${this.baseUrl}api/v1/users/create`;
    const headers = ApiClient.formatHeaders(xApiKey);
    const attributes = {
      name, email, password, type,
    };
    const body = ApiClient.formatPayload(type, attributes);
    const request = new Request(url, { method: 'POST', body, headers });
    return ApiClient.processRequest(request);
  }

  showUser(id, xApiKey) {
    const url = `${this.baseUrl}api/v1/users/${id}`;
    const headers = ApiClient.formatHeaders(xApiKey);
    const request = new Request(url, { method: 'GET', headers });
    return ApiClient.processRequest(request);
  }

  updateUser(id, name, email, password, type = 'Tester', xApiKey) {
    const url = `${this.baseUrl}api/v1/users/${id}`;
    const headers = ApiClient.formatHeaders(xApiKey);
    const attributes = {
      name, email, password, type,
    };
    const body = ApiClient.formatPayload(type, attributes);
    const request = new Request(url, { method: 'PUT', body, headers });
    return ApiClient.processRequest(request);
  }

  deleteUser(id, xApiKey) {
    const url = `${this.baseUrl}api/v1/users/${id}`;
    const headers = ApiClient.formatHeaders(xApiKey);
    const request = new Request(url, { method: 'DELETE', headers });
    return ApiClient.processRequest(request);
  }

  getAllUserReports(id, xApiKey) {
    const url = `${this.baseUrl}api/v1/users/${id}/reports`;
    const headers = ApiClient.formatHeaders(xApiKey);
    const request = new Request(url, { method: 'GET', headers });
    return ApiClient.processRequest(request);
  }
}

export default UsersClient;
