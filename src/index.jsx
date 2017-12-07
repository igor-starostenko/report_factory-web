import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import promise from 'redux-promise';

import reducers from './reducers';
import Home from './components/home';
import Login from './components/login';
import NotFound from './components/not_found';
import ProjectsIndex from './components/projects_index';
// import ProjectsShow from './components/projects_show';

const createStoreWithMiddleware = applyMiddleware(promise)(createStore);

// <Route path="/projects/:name" component={ProjectsShow} />
// <Route path="/projects" component={ProjectsIndex} />
ReactDOM.render(
  <Provider store={createStoreWithMiddleware(reducers)}>
    <BrowserRouter>
      <div>
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/projects" component={ProjectsIndex} />
          <Route exact path="/" component={Home} />
          <Route path="*" component={NotFound} />
        </Switch>
      </div>
    </BrowserRouter>
  </Provider>,
  document.querySelector('.container'),
);

