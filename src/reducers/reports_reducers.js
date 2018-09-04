// import _ from 'lodash';
import {
  GET_REPORTS, GET_RSPEC_REPORT, RESET_RSPEC_REPORT, GET_RSPEC_REPORTS,
  SET_RSPEC_REPORTS_PAGE, SET_RSPEC_REPORTS_TAGS, GET_RSPEC_REPORTS_SUCCESS,
  GET_RSPEC_REPORTS_FAILURE, RESET_RSPEC_REPORTS, RSPEC_REPORTS,
  RSPEC_REPORTS_QUERY
} from '../actions/reports_actions';

const INITIAL_STATE = {
  reportsList: {
    data: null, error: null, loading: false, perPage: 10, page: 1, tags: [],
  },
  rspecReportsList: {
    data: null, error: null, loading: false, perPage: 10, page: 1, tags: [],
  },
  rspecReportsConnection: {
    edges: null, pageInfo: null, totalCount: null, errors: null,
    query: { first: 10, tags: [] },
  },
  activeRspecReport: { data: null, error: null, loading: false },
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case RSPEC_REPORTS: {
      const { query } = state.rspecReportsConnection;
      let { rspecReportsConnection } = action.payload.data;
      const { edges, pageInfo, totalCount, errors } = rspecReportsConnection;
      rspecReportsConnection = { edges, pageInfo, totalCount, errors, query };
      return { ...state, rspecReportsConnection };
    }
    case RSPEC_REPORTS_QUERY: {
      const query = action.payload;
      const rspecReportsConnection = { ...state.rspecReportsConnection, query };
      return { ...state, rspecReportsConnection };
    }
    case GET_REPORTS: {
      // const data = _.mapKeys(action.payload.data, obj => obj.id);
      const { data } = action.payload;
      return { ...state, reportsList: { data, error: null, loading: false } };
    }
    case GET_RSPEC_REPORT: {
      const { data } = action.payload;
      return { ...state, activeRspecReport: { data, error: null, loading: false } };
    }
    case RESET_RSPEC_REPORT: {
      return { ...state, activeRspecReport: INITIAL_STATE.activeRspecReport };
    }
    case GET_RSPEC_REPORTS: {
      const rspecReportsList = { ...state.rspecReportsList, error: null, loading: true };
      return { ...state, rspecReportsList };
    }
    case SET_RSPEC_REPORTS_PAGE: {
      /* eslint-disable object-curly-newline */
      const page = parseInt(action.payload.get('Page'), 10);
      const perPage = parseInt(action.payload.get('Per-Page'), 10);
      const total = parseInt(action.payload.get('Total'), 10);
      return { ...state, rspecReportsList: { ...state.rspecReportsList, perPage, page, total } };
    }
    case SET_RSPEC_REPORTS_TAGS: {
      const tags = action.payload;
      return { ...state, rspecReportsList: { ...state.rspecReportsList, tags } };
    }
    case GET_RSPEC_REPORTS_SUCCESS: {
      // const data = _.mapKeys(action.payload.data, obj => obj.id);
      const { data } = action.payload;
      const rspecReportsList = { ...state.rspecReportsList, data, error: null, loading: false };
      return { ...state, rspecReportsList };
      /* eslint-enable object-curly-newline */
    }
    case GET_RSPEC_REPORTS_FAILURE: {
      const error = action.payload.errors;
      const { data } = state.rspecReportsList;
      return { ...state, rspecReportsList: { data, error, loading: false } };
    }
    case RESET_RSPEC_REPORTS: {
      return { ...state, rspecReportsList: INITIAL_STATE.rspecReportsList };
    }
    default: {
      return state;
    }
  }
};
