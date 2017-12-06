import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import promise from 'redux-promise';

import reducers from './reducers';
import Home from './components/home';
// import Login from './components/login';
// import ProjectsIndex from './components/projects_index';
// import ProjectsShow from './components/projects_show';

const createStoreWithMiddleware = applyMiddleware(promise)(createStore);

// <Route path="/login" component={Login} />
// <Route path="/projects/:name" component={ProjectsShow} />
// <Route path="/projects" component={ProjectsIndex} />
ReactDOM.render(
  <Provider store={createStoreWithMiddleware(reducers)}>
    <BrowserRouter>
      <div>
        <Switch>
          <Route path="/" component={Home} />
        </Switch>
      </div>
    </BrowserRouter>
  </Provider>,
  document.querySelector('.container'),
);

// import { UsersClient } from '../api/users_client';

// const apiUrl = process.env.API_URL;
// const api = new UsersClient(apiUrl);
// const adminXApiKey = 'b6922679-446e-4e12-8d4f-26cface97a02';
// const testerXApiKey = '9e04136f-c71d-4d16-924a-216e9af08903';
// api.getAllUsers(testerXApiKey);
// api.loginUser('tester@mailinator.com', 'Qwerty12');
// api.createUser('New', 'testerNew@mailinator.com', 'Qwerty12', 'Tester', adminXApiKey);
// api.showUser(1, testerXApiKey);
// api.updateUser(5, 'Update', 'update_5@mailinator.com', 'Qwerty12', 'Tester', adminXApiKey);
// api.deleteUser(8, adminXApiKey);
// api.getAllUserReports(1, testerXApiKey);
