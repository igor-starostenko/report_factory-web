import _ from 'lodash';
import { GET_PROJECT_REPORTS, GET_PROJECT_RSPEC_REPORTS, GET_PROJECT_RSPEC_REPORTS_SUCCESS,
  GET_PROJECT_RSPEC_REPORTS_FAILURE, GET_PROJECT_RSPEC_REPORT, SET_PROJECT_RSPEC_REPORTS_PAGE,
  SET_PROJECT_RSPEC_REPORTS_TAGS, RESET_PROJECT_RSPEC_REPORTS } from '../actions/project_reports_actions';

const INITIAL_STATE = {
  reportsList: {
    data: null, error: null, loading: false, perPage: 30, page: 1, total: null, tags: [],
  },
  rspecReportsList: {
    data: null, error: null, loading: false, perPage: 10, page: 1, total: null, tags: [],
  },
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_PROJECT_REPORTS: {
      const { data } = action.payload;
      if (data[0]) {
        const projectName = data[0].attributes.project_name;
        return { ...state, reportsList: { [projectName]: _.mapKeys(data, obj => obj.id) } };
      }
      return { ...state };
    }
    case SET_PROJECT_RSPEC_REPORTS_PAGE: {
      /* eslint-disable object-curly-newline */
      const page = parseInt(action.payload.get('Page'), 10);
      const perPage = parseInt(action.payload.get('Per-Page'), 10);
      const total = parseInt(action.payload.get('Total'), 10);
      return { ...state, rspecReportsList: { ...state.rspecReportsList, perPage, page, total } };
    }
    case SET_PROJECT_RSPEC_REPORTS_TAGS: {
      const tags = action.payload;
      return { ...state, rspecReportsList: { ...state.rspecReportsList, tags } };
    }
    case GET_PROJECT_RSPEC_REPORTS: {
      const rspecReportsList = { ...state.rspecReportsList, error: null, loading: true };
      return { ...state, rspecReportsList };
    }
    case GET_PROJECT_RSPEC_REPORTS_SUCCESS: {
      const { data } = action.payload;
      const rspecReportsList = { ...state.rspecReportsList, data, error: null, loading: false };
      return { ...state, rspecReportsList };
      /* eslint-enable object-curly-newline */
    }
    case GET_PROJECT_RSPEC_REPORTS_FAILURE: {
      const error = action.payload.errors;
      const { data } = state.rspecReportsList;
      return { ...state, rspecReportsList: { data, error, loading: false } };
    }
    case RESET_PROJECT_RSPEC_REPORTS: {
      return { ...state, rspecReportsList: INITIAL_STATE.rspecReportsList };
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
