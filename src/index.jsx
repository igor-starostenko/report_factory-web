import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import { Router, Route, Switch, withRouter } from 'react-router-dom';
import promise from 'redux-promise';

import history from './history';
import reducers from './reducers';

import 'bootstrap/dist/css/bootstrap.css';

import { NotFound } from './components';
import App from './containers/app';
import Home from './containers/home';
import Login from './containers/login';
import CreateProject from './containers/create_project';
import UpdateProject from './containers/update_project';
import UpdateUser from './containers/update_user';
import Project from './containers/project';
import Projects from './containers/projects';
import ProjectRspecReports from './containers/project_rspec_reports';
import RequireAuth from './containers/authentication';
import Reports from './containers/reports';
import RspecReport from './containers/rspec_report';
import CreateUser from './containers/create_user';
import User from './containers/user';
import Users from './containers/users';
import Scenarios from './containers/scenarios';

/* eslint-disable no-underscore-dangle */
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
/* eslint-enable no-underscore-dangle */
const store = createStore(reducers, composeEnhancers(applyMiddleware(promise)));

const AppRouter = withRouter(App);

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <AppRouter path="/">
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/users/new" component={RequireAuth(CreateUser)} />
          <Route path="/users/:id/edit" component={RequireAuth(UpdateUser)} />
          <Route path="/users/:id" component={RequireAuth(User)} />
          <Route path="/users" component={RequireAuth(Users)} />
          <Route
            path="/projects/:name/edit"
            component={RequireAuth(UpdateProject)}
          />
          <Route
            path="/projects/:name/rspec"
            component={RequireAuth(ProjectRspecReports)}
          />
          <Route path="/projects/:name" component={RequireAuth(Project)} />
          <Route path="/projects" component={RequireAuth(Projects)} />
          <Route path="/project/new" component={RequireAuth(CreateProject)} />
          <Route path="/reports/:id" component={RequireAuth(RspecReport)} />
          <Route path="/reports" component={RequireAuth(Reports)} />
          <Route path="/scenarios" component={RequireAuth(Scenarios)} />
          <Route exact path="/" component={Home} />
          <Route path="*" component={NotFound} />
        </Switch>
      </AppRouter>
    </Router>
  </Provider>,
  document.querySelector('.app'),
);

export default store;
