import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import UsersReducers from './users_reducers';
import ProjectsReducers from './projects_reducers';
import xApiKey from './xapikey_reducers';

const rootReducer = combineReducers({
  currentUser: UsersReducers,
  projects: ProjectsReducers,
  form: formReducer,
  xApiKey,
});

export default rootReducer;
