import _ from 'lodash';
import { EDIT_PROJECT, EDIT_PROJECT_SUCCESS, EDIT_PROJECT_FAILURE, RESET_EDIT_PROJECT,
  GET_PROJECT, GET_PROJECTS } from '../actions/projects_actions';

const INITIAL_STATE = {
  activeProject: { data: null, error: null, loading: false },
  editProject: { data: null, error: null, loading: false },
  projectsList: { data: null, error: null, loading: false },
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_PROJECTS: {
      const list = _.mapKeys(action.payload.data, obj => obj.attributes.project_name);
      return { ...state, projectsList: { data: list, error: null, loading: false } };
    }
    case GET_PROJECT: {
      const { data } = action.payload;
      return { ...state, activeProject: { data, error: null, loading: false } };
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
