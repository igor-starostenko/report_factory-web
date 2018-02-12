import { combineReducers } from 'redux';
import { reducer as form } from 'redux-form';
import users from './users_reducers';
import projects from './projects_reducers';
import reports from './reports_reducers';
import rspecReports from './rspec_reports_reducers';

const rootReducer = combineReducers({
  form, users, projects, reports, rspecReports,
});

export default rootReducer;
