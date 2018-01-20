import { combineReducers } from 'redux';
import { reducer as form } from 'redux-form';
import currentUser from './current_user_reducers';
import projects from './projects_reducers';
import reports from './reports_reducers';
import rspecReports from './rspec_reports_reducers';
import xApiKey from './xapikey_reducers';

const rootReducer = combineReducers({
  currentUser, form, projects, reports, rspecReports, xApiKey,
});

export default rootReducer;
