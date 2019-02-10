import _ from 'lodash';
import {
  EDIT_PROJECT,
  EDIT_PROJECT_SUCCESS,
  EDIT_PROJECT_FAILURE,
  RESET_EDIT_PROJECT,
  GET_PROJECT,
  GET_PROJECTS,
  PROJECTS,
  PROJECT,
  PROJECT_FILTERS,
  RESET_ACTIVE_PROJECT,
} from '../actions/projects_actions';

const INITIAL_STATE = {
  activeProject: { data: null, error: null, loading: false },
  editProject: { data: null, error: null, loading: false },
  list: { data: {}, loaded: false },
  details: { data: {}, filters: {} },
};

/* eslint-disable arrow-body-style */
const arrayToObject = (array, getKey) => {
  return array.reduce((obj, item) => ({ ...obj, [getKey(item)]: item }), {});
};
/* eslint-enable arrow-body-style */

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case PROJECTS: {
      const { projects } = action.payload.data;
      const data = arrayToObject(projects, project => project.projectName);
      return { ...state, list: { data, loaded: true } };
    }
    case PROJECT: {
      const { project } = action.payload.data;
      const data = { ...state.details.data, [project.projectName]: project };
      return { ...state, details: { ...state.details, data } };
    }
    case PROJECT_FILTERS: {
      const { projectName, data } = action.payload;
      const filters = { ...state.details.filters, [projectName]: data };
      return { ...state, details: { ...state.details, filters } };
    }
    case GET_PROJECTS: {
      const list = _.mapKeys(
        action.payload.data,
        obj => obj.attributes.project_name,
      );
      return {
        ...state,
        projectsList: { data: list, error: null, loading: false },
      };
    }
    case GET_PROJECT: {
      const { data } = action.payload;
      return { ...state, activeProject: { data, error: null, loading: false } };
    }
    case RESET_ACTIVE_PROJECT: {
      return {
        ...state,
        activeProject: { data: null, error: null, loading: false },
      };
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
      return {
        ...state,
        editProject: { data: null, error: null, loading: false },
      };
    }
    default: {
      return state;
    }
  }
};
