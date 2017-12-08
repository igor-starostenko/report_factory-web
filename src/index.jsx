import React from 'react';
import ReactDOM from 'react-dom';
import { CookiesProvider } from 'react-cookie';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import promise from 'redux-promise';

import Home from './components/home';
import Login from './components/login';
import NotFound from './components/not_found';
import Project from './components/project';
import Projects from './components/projects';
import reducers from './reducers';

const createStoreWithMiddleware = applyMiddleware(promise)(createStore);

ReactDOM.render(
  <CookiesProvider>
    <Provider store={createStoreWithMiddleware(reducers)}>
      <BrowserRouter>
        <div>
          <Switch>
            <Route path="/login" component={Login} />
            <Route path="/projects" component={Projects} />
            <Route path="/projects/:name" component={Project} />
            <Route exact path="/" component={Home} />
            <Route path="*" component={NotFound} />
          </Switch>
        </div>
      </BrowserRouter>
    </Provider>
  </CookiesProvider>,
  document.querySelector('.container'),
);

