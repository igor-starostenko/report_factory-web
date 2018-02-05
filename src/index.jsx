import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import { Router, Route, Switch } from 'react-router-dom';
import promise from 'redux-promise';

import App from './components/app';
import Home from './components/home';
import Login from './components/login';
import CreateProject from './components/create_project';
import UpdateProject from './components/update_project';
import NotFound from './components/not_found';
import Project from './components/project';
import Projects from './components/projects';
import RequireAuth from './components/authentication';
import RspecReports from './components/rspec_reports';
import User from './components/user';
import Users from './components/users';
import history from './history';
import reducers from './reducers';

require('babel-core/register');
require('babel-polyfill');

/* eslint-disable no-underscore-dangle */
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
/* eslint-enable no-underscore-dangle */
const store = createStore(reducers, composeEnhancers(applyMiddleware(promise)));

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <div>
        <App path="/">
          <Switch>
            <Route path="/login" component={Login} />
            <Route path="/users" component={RequireAuth(Users)} />
            <Route path="/user" component={RequireAuth(User)} />
            <Route path="/projects/:name/edit" component={RequireAuth(UpdateProject)} />
            <Route path="/projects/:name/rspec" component={RequireAuth(RspecReports)} />
            <Route path="/projects/:name" component={RequireAuth(Project)} />
            <Route path="/projects" component={RequireAuth(Projects)} />
            <Route path="/project/new" component={RequireAuth(CreateProject)} />
            <Route exact path="/" component={Home} />
            <Route path="*" component={NotFound} />
          </Switch>
        </App>
      </div>
    </Router>
  </Provider>,
  document.querySelector('.app'),
);

export default store;
