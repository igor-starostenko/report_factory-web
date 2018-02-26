import _ from 'lodash';
import { GET_REPORTS, GET_RSPEC_REPORTS, SET_RSPEC_REPORTS_PAGE,
  GET_RSPEC_REPORTS_SUCCESS, GET_RSPEC_REPORTS_FAILURE } from '../actions/reports_actions';

const INITIAL_STATE = {
  reportsList: {
    data: null, error: null, loading: false, perPage: 30, page: 1,
  },
  rspecReportsList: {
    data: null, error: null, loading: false, perPage: 10, page: 1,
  },
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_REPORTS: {
      const { data } = action.payload;
      if (data[0]) {
        const projectName = data[0].attributes.project_name;
        return { ...state, reportsList: { [projectName]: _.mapKeys(data, obj => obj.id) } };
      }
      return { ...state };
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
    case GET_RSPEC_REPORTS_SUCCESS: {
      const data = _.mapKeys(action.payload.data, obj => obj.id);
      const rspecReportsList = { ...state.rspecReportsList, data, error: null, loading: false };
      return { ...state, rspecReportsList };
      /* eslint-enable object-curly-newline */
    }
    case GET_RSPEC_REPORTS_FAILURE: {
      const error = action.payload.errors;
      const { data } = state.rspecReportsList;
      return { ...state, rspecReportsList: { data, error, loading: false } };
    }
    default: {
      return state;
    }
  }
};
