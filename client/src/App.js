import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Login from './pages/Login/login'
import Signup from './pages/Signup/signup'
import Dashboard from './pages/Dashboard/dashboard'
import PostPage from './pages/Post/post'
import User from './pages/User/user'
import Setting from './pages/Setting/setting'
import Verify from './pages/Verify/verify'
import AuthRoute from './util/AuthRoute'
import './index.css'

import { Provider } from 'react-redux';
import { SET_AUTHENTICATED } from './redux/types';
import { getUserData, logout } from './redux/actions/userActions'
import store from './redux/store'

import axios from 'axios';

const token = localStorage.JWTToken;
if(token) {
    axios.defaults.headers.common['Authorization'] = token;
    store.dispatch({type: SET_AUTHENTICATED})
}

store.dispatch(getUserData())
    .catch((err) => {
        if(err.response.status === '401') { // Unauthorized
            store.dispatch(logout())
        }
    })

function App() {
  return (
    <Provider store = {store}>
      <Router>
        <Switch>
          <Route exact path = "/login" component = {Login}></Route>
          <Route exact path = "/signup" component = {Signup}></Route>
          <Route exact path = "/verify/:id" component = {Verify}></Route>
          <AuthRoute exact path = "/" component = {Dashboard}></AuthRoute>
          <AuthRoute exact path = "/posts/:id" component = {PostPage}></AuthRoute>
          <AuthRoute exact path = "/users/:id" component = {User}></AuthRoute>
          <AuthRoute exact path = "/setting" component = {Setting}></AuthRoute>
        </Switch>
      </Router>
    </Provider>
  );
}

export default App;
