import ApiClient from './api_client';

class ReportsClient extends ApiClient {
  // Allows :first, :last, :before, :after, :tags variables
  queryReports(xApiKey, variables) {
    const headers = ApiClient.formatHeaders(xApiKey);
    return this.query({
      query: `query reportsConnection($first: Int, $last: Int, $before: String, $after: String, $tags: [String]) {
        reportsConnection(first: $first, last: $last, after: $after, before: $before, tags: $tags) {
          totalCount
          pageInfo {
            startCursor
            endCursor
            hasNextPage
            hasPreviousPage
          }
          edges {
            cursor
            node {
              id
              projectName
              status
              reportableType
              createdAt
              reportable {
                summary {
                  duration
                  exampleCount
                  pendingCount
                  failureCount
                }
              }
            }
          }
        }
      }`,
      variables,
      headers,
    });
  }

  // Allows :first, :last, :before, :after, :tags variables
  queryRspecReports(xApiKey, variables) {
    const headers = ApiClient.formatHeaders(xApiKey);
    return this.query({
      query: `query rspecReportsConnection($first: Int, $last: Int, $before: String, $after: String, $tags: [String], $projectName: String) {
        rspecReportsConnection(first: $first, last: $last, after: $after, before: $before, tags: $tags, projectName: $projectName) {
          totalCount
          pageInfo {
            startCursor
            endCursor
            hasNextPage
            hasPreviousPage
          }
          edges {
            cursor
            node {
              id
              report {
                projectName
                reportableType
                createdAt
              }
              summary {
                duration
                exampleCount
                pendingCount
                failureCount
              }
            }
          }
        }
      }`,
      variables,
      headers,
    });
  }

  getReports(xApiKey, options) {
    const url = `${this.baseUrl}api/v1/reports`;
    const params = this.constructor.formatQuery(options);
    const headers = ApiClient.formatHeaders(xApiKey);
    return fetch(new Request(url + params, { method: 'GET', headers }));
  }

  getRspecReports(xApiKey, options) {
    const url = `${this.baseUrl}api/v1/reports/rspec`;
    const params = this.constructor.formatQuery(options);
    const headers = ApiClient.formatHeaders(xApiKey);
    return fetch(new Request(url + params, { method: 'GET', headers }));
  }

  showRspecReport(reportId, xApiKey) {
    const url = `${this.baseUrl}api/v1/reports/rspec/${reportId}`;
    const headers = ApiClient.formatHeaders(xApiKey);
    return fetch(new Request(url, { method: 'GET', headers }));
  }

  getAllProjectReports(projectName, xApiKey) {
    const url = `${this.baseUrl}api/v1/projects/${projectName}/reports`;
    const headers = ApiClient.formatHeaders(xApiKey);
    return fetch(new Request(url, { method: 'GET', headers }));
  }

  getAllProjectRspecReports(projectName, xApiKey, options) {
    const url = `${this.baseUrl}api/v1/projects/${projectName}/reports/rspec`;
    const params = this.constructor.formatQuery(options);
    const headers = ApiClient.formatHeaders(xApiKey);
    return fetch(new Request(url + params, { method: 'GET', headers }));
  }

  showProjectRspecReport(projectName, id, xApiKey) {
    const url = `${this.baseUrl}api/v1/projects/${projectName}/reports/rspec/${id}`;
    const headers = ApiClient.formatHeaders(xApiKey);
    return fetch(new Request(url, { method: 'GET', headers }));
  }
}

export default ReportsClient;
