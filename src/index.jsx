import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { Router, Route, Switch } from 'react-router-dom';
import promise from 'redux-promise';

import App from './components/app';
import RequireAuth from './components/authentication';
import Home from './components/home';
import Login from './components/login';
import NotFound from './components/not_found';
import Project from './components/project';
import Projects from './components/projects';
import RspecReports from './components/rspec_reports';
import history from './history';
import reducers from './reducers';

require('babel-core/register');
require('babel-polyfill');

const store = createStore(reducers, applyMiddleware(promise));

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <div>
        <App path="/">
          <Switch>
            <Route path="/login" component={Login} />
            <Route path="/projects/:name/rspec" component={RequireAuth(RspecReports)} />
            <Route path="/projects/:name" component={RequireAuth(Project)} />
            <Route path="/projects" component={RequireAuth(Projects)} />
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
