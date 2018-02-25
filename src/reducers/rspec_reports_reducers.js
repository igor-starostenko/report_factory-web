import _ from 'lodash';
import { GET_PROJECT_RSPEC_REPORTS, GET_PROJECT_RSPEC_REPORTS_SUCCESS,
  GET_PROJECT_RSPEC_REPORTS_FAILURE, GET_PROJECT_RSPEC_REPORT,
  SET_PROJECT_RSPEC_REPORTS_PAGE, RESET_PROJECT_RSPEC_REPORTS } from '../actions/reports_actions';

const INITIAL_STATE = {
  reportsList: {
    data: null, error: null, loading: false, perPage: 10, page: 1,
  },
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SET_PROJECT_RSPEC_REPORTS_PAGE: {
      /* eslint-disable object-curly-newline */
      const page = parseInt(action.payload.get('Page'), 10);
      const perPage = parseInt(action.payload.get('Per-Page'), 10);
      const total = parseInt(action.payload.get('Total'), 10);
      return { ...state, reportsList: { ...state.reportsList, perPage, page, total } };
    }
    case GET_PROJECT_RSPEC_REPORTS: {
      return { ...state, reportsList: { ...state.reportsList, error: null, loading: true } };
    }
    case GET_PROJECT_RSPEC_REPORTS_SUCCESS: {
      const data = _.mapKeys(action.payload.data, obj => obj.id);
      return { ...state, reportsList: { ...state.reportsList, data, error: null, loading: false } };
      /* eslint-enable object-curly-newline */
    }
    case GET_PROJECT_RSPEC_REPORTS_FAILURE: {
      const error = action.payload.errors;
      const { data } = state.reportsList;
      return { ...state, reportsList: { data, error, loading: false } };
    }
    case RESET_PROJECT_RSPEC_REPORTS: {
      return { ...state, reportsList: INITIAL_STATE.reportsList };
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
