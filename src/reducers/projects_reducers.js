import _ from 'lodash';
import { CREATE_PROJECT, CREATE_PROJECT_SUCCESS, CREATE_PROJECT_FAILURE, RESET_NEW_PROJECT,
         GET_PROJECT, GET_PROJECTS } from '../actions';

export default (state = {}, action) => {
  let error;
  switch (action.type) {
    case GET_PROJECTS:
      const list = _.mapKeys(action.payload.data, obj => obj.attributes.project_name);
      return { ...state, projectsList: { data: list, error: null, loading: false} };
    case GET_PROJECT:
      return { ...state, activeProject: { data: action.payload.data, error: null, loading: false } };
    case CREATE_PROJECT:
      return { ...state, newProject: { ...state.newProject, loading: true } };
    case CREATE_PROJECT_SUCCESS:
      return { ...state, newProject: { data: action.payload.data, error: null, loading: false } };
    case CREATE_PROJECT_FAILURE:
      error = action.payload.errors;
      return { ...state, newProject: { data: null, error: error, loading: false} };
    case RESET_NEW_PROJECT:
    	return { ...state, newProject: { data: null, error: null, loading: false} };
    default: {
      return state;
    }
  }
};
