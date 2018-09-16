import _ from 'lodash';
import {
  EDIT_PROJECT, EDIT_PROJECT_SUCCESS, EDIT_PROJECT_FAILURE, RESET_EDIT_PROJECT,
  GET_PROJECT, GET_PROJECTS, PROJECT, PROJECT_FILTERS, RESET_ACTIVE_PROJECT,
} from '../actions/projects_actions';

const INITIAL_STATE = {
  activeProject: { data: null, error: null, loading: false },
  editProject: { data: null, error: null, loading: false },
  projectsList: { data: null, error: null, loading: false },
  list: { data: {}, error: null, loading: false },
  filters: {},
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case PROJECT: {
      const { project } = action.payload.data;
      const data = { ...state.list.data, [project.projectName]: project };
      return { ...state, list: { data, error: null, loading: false } };
    }
    case PROJECT_FILTERS: {
      const { projectName, data } = action.payload;
      const filters = { ...state.filters.data, [projectName]: data };
      return { ...state, filters };
    }
    case GET_PROJECTS: {
      const list = _.mapKeys(action.payload.data, obj => obj.attributes.project_name);
      return { ...state, projectsList: { data: list, error: null, loading: false } };
    }
    case GET_PROJECT: {
      const { data } = action.payload;
      return { ...state, activeProject: { data, error: null, loading: false } };
    }
    case RESET_ACTIVE_PROJECT: {
      return { ...state, activeProject: { data: null, error: null, loading: false } };
    }
    case EDIT_PROJECT: {
      return { ...state, editProject: { ...state.editProject, loading: true } };
    }
    case EDIT_PROJECT_SUCCESS: {
      const { data } = action.payload;
      return { ...state, editProject: { data, error: null, loading: false } };
    }
    case EDIT_PROJECT_FAILURE: {
      const error = action.payload.errors;
      return { ...state, editProject: { data: null, error, loading: false } };
    }
    case RESET_EDIT_PROJECT: {
      return { ...state, editProject: { data: null, error: null, loading: false } };
    }
    default: {
      return state;
    }
  }
};
