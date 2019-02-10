import { combineReducers } from 'redux';
import { reducer as form } from 'redux-form';
import users from './users_reducers';
import projects from './projects_reducers';
import projectReports from './project_reports_reducers';
import scenarios from './scenarios_reducers';
import reports from './reports_reducers';

const rootReducer = combineReducers({
  form,
  users,
  projects,
  projectReports,
  scenarios,
  reports,
});

export default rootReducer;
