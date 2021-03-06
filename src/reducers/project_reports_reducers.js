import _ from 'lodash';
import {
  GET_PROJECT_REPORTS,
  GET_PROJECT_REPORTS_SUCCESS,
  GET_PROJECT_REPORTS_FAILURE,
  GET_PROJECT_RSPEC_REPORTS,
  GET_PROJECT_RSPEC_REPORTS_SUCCESS,
  GET_PROJECT_RSPEC_REPORTS_FAILURE,
  GET_PROJECT_RSPEC_REPORT,
  SET_PROJECT_RSPEC_REPORTS_PAGE,
  SET_PROJECT_RSPEC_REPORTS_TAGS,
  RESET_PROJECT_RSPEC_REPORTS,
  PROJECT_RSPEC_REPORTS,
  PROJECT_RSPEC_REPORTS_QUERY,
} from '../actions/project_reports_actions';

const INITIAL_STATE = {
  reportsList: {},
  rspecReportsConnection: {
    edges: null,
    pageInfo: null,
    totalCount: null,
    errors: null,
    query: { page: 1, perPage: 10, tags: [] },
  },
  rspecReportsList: {
    data: null,
    error: null,
    loading: false,
    perPage: 10,
    page: 1,
    total: null,
    tags: [],
  },
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case PROJECT_RSPEC_REPORTS: {
      const { query } = state.rspecReportsConnection;
      let { rspecReportsConnection } = action.payload.data;
      const { edges, pageInfo, totalCount, errors } = rspecReportsConnection;
      rspecReportsConnection = {
        edges,
        pageInfo,
        totalCount,
        errors,
        query,
      };
      return { ...state, rspecReportsConnection };
    }
    case PROJECT_RSPEC_REPORTS_QUERY: {
      const query = action.payload;
      const rspecReportsConnection = { ...state.rspecReportsConnection, query };
      return { ...state, rspecReportsConnection };
    }
    case GET_PROJECT_REPORTS: {
      const { projectName } = action.payload;
      const reportsList = {
        [projectName]: { data: null, error: null, loading: true },
      };
      return { ...state, reportsList };
    }
    case GET_PROJECT_REPORTS_SUCCESS: {
      const { data } = action.payload;
      const currentProject = _.pickBy(
        state.reportsList,
        project => project.loading,
      );
      const projectName = Object.keys(currentProject)[0];
      if (_.isEmpty(data)) {
        const reportsList = {
          [projectName]: { data: [], error: null, loading: false },
        };
        return { ...state, reportsList };
      }
      const projectReports = _.mapKeys(data, obj => obj.id);
      const reportsList = {
        [projectName]: { data: projectReports, error: null, loading: false },
      };
      return { ...state, reportsList };
    }
    case GET_PROJECT_REPORTS_FAILURE: {
      const error = action.payload.errors;
      const currentProject = _.pickBy(
        state.reportsList,
        project => project.loading,
      );
      const projectName = Object.keys(currentProject)[0];
      return {
        ...state,
        reportsList: { [projectName]: { data: null, error, loading: false } },
      };
    }
    case SET_PROJECT_RSPEC_REPORTS_PAGE: {
      /* eslint-disable object-curly-newline */
      const page = parseInt(action.payload.get('Page'), 10);
      const perPage = parseInt(action.payload.get('Per-Page'), 10);
      const total = parseInt(action.payload.get('Total'), 10);
      return {
        ...state,
        rspecReportsList: { ...state.rspecReportsList, perPage, page, total },
      };
    }
    case SET_PROJECT_RSPEC_REPORTS_TAGS: {
      const tags = action.payload;
      return {
        ...state,
        rspecReportsList: { ...state.rspecReportsList, tags },
      };
    }
    case GET_PROJECT_RSPEC_REPORTS: {
      const rspecReportsList = {
        ...state.rspecReportsList,
        error: null,
        loading: true,
      };
      return { ...state, rspecReportsList };
    }
    case GET_PROJECT_RSPEC_REPORTS_SUCCESS: {
      const { data } = action.payload;
      const rspecReportsList = {
        ...state.rspecReportsList,
        data,
        error: null,
        loading: false,
      };
      return { ...state, rspecReportsList };
      /* eslint-enable object-curly-newline */
    }
    case GET_PROJECT_RSPEC_REPORTS_FAILURE: {
      const error = action.payload.errors;
      const { data } = state.rspecReportsList;
      return { ...state, rspecReportsList: { data, error, loading: false } };
    }
    case RESET_PROJECT_RSPEC_REPORTS: {
      const { rspecReportsList, rspecReportsConnection } = INITIAL_STATE;
      return { ...state, rspecReportsList, rspecReportsConnection };
    }
    case GET_PROJECT_RSPEC_REPORT: {
      const { data } = action.payload;
      if (data) {
        const projectName = data.attributes.project_name;
        return { ...state, [projectName]: { [data.id]: data } };
      }
      return { ...state };
    }
    default: {
      return state;
    }
  }
};
