import _ from 'lodash';
import { EDIT_PROJECT, EDIT_PROJECT_SUCCESS, EDIT_PROJECT_FAILURE, RESET_EDIT_PROJECT,
         GET_PROJECT, GET_PROJECTS } from '../actions/projects_actions';

export default (state = {}, action) => {
  let error;
  switch (action.type) {
    case GET_PROJECTS:
      const list = _.mapKeys(action.payload.data, obj => obj.attributes.project_name);
      return { ...state, projectsList: { data: list, error: null, loading: false} };
    case GET_PROJECT:
      return { ...state, activeProject: { data: action.payload.data, error: null, loading: false } };
    case EDIT_PROJECT:
      return { ...state, editProject: { ...state.editProject, loading: true } };
    case EDIT_PROJECT_SUCCESS:
      return { ...state, editProject: { data: action.payload.data, error: null, loading: false } };
    case EDIT_PROJECT_FAILURE:
      error = action.payload.errors;
      return { ...state, editProject: { data: null, error: error, loading: false} };
    case RESET_EDIT_PROJECT:
    	return { ...state, editProject: { data: null, error: null, loading: false} };
    default: {
      return state;
    }
  }
};
