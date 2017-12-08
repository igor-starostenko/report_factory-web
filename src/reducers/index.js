import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import UsersReducers from './users_reducers';
import ProjectsReducers from './projects_reducers';

const rootReducer = combineReducers({
  users: UsersReducers,
  projects: ProjectsReducers,
  form: formReducer,
});

export default rootReducer;
