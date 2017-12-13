import { combineReducers } from 'redux';
import { reducer as form } from 'redux-form';
import currentUser from './current_user_reducers';
import projects from './projects_reducers';
import xApiKey from './xapikey_reducers';

const rootReducer = combineReducers({
  currentUser, form, projects, xApiKey,
});

export default rootReducer;
