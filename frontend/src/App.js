import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import 'react-notifications/lib/notifications.css'
import 'materialize-css/dist/css/materialize.min.css'
import 'materialize-css/dist/js/materialize.min.js'
import 'animate.css'


import './App.css';

import Navbar from './components/layouts/Navegation';
import Signin from './components/auth/SignIn';
import Profile from './components/user/Profile';
import Signup from './components/auth/SignUp';
import Landing from './components/layouts/Landing';
import Rol from './components/auth/Rol';
import ActionUsers from './components/auth/ActionUsers';
import Product from './components/Product/Product'
import Clientes from './components/cliente/Cliente'

export default class App extends Component {

  render() {
    return (
      <Router>
        <div className="App">
          <Navbar/>
          <Switch>
            <Route exact path="/signin" component={Signin} />
            <Route exact path="/" component={Landing} />
            <Route exact path="/signup" component={Signup} />
            <Route exact path="/profile" component={Profile} />
            <Route exact path="/rols" component={Rol} />
            <Route exact path="/action-users" component={ActionUsers} />
            <Route exact path="/products" component={Product} />
            <Route exact path="/clientes" component={Clientes} />
          </Switch>
        </div>
      </Router>
    )
  }
}
