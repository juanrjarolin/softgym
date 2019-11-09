import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'
import 'react-notifications/lib/notifications.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'animate.css'

import './App.css';

import Navbar from './components/layouts/Navegation';
import Signin from './components/auth/SignIn';
import Profile from './components/user/Profile';
import Signup from './components/auth/SignUp';
import Landing from './components/layouts/Landing';
import Rol from './components/auth/Rol';
import ActionUsers from './components/auth/ActionUsers';
import Product from './components/productos/Product'
import Personas from './components/personas/Personas'
import Equipos from './components/equipos/Equipo'
import Mantenimiento from './components/mantenimiento/Mantenimiento'
import RegistroMantenimiento from './components/mantenimiento/RegistroMantenimiento'
import Clases from './components/clases/Clases'
import Reservas from './components/reservas/Reserva'
import Sucursales from './components/sucursales/Sucursal'
import VentaProducto from './components/ventas/Product'
import Recuperacion from './components/auth/Recuperacion'
import Permisos from './components/auth/Permisos'
import CategoriaMaquina from './components/equipos/Categoria'
import DetalleMantenimiento from './components/mantenimiento/Detalles'

export default class App extends Component {

  render() {
    return (
      <Router>
        <div className="App">
          <Navbar/>
          <Switch>
            <Route exact path="/" component={Landing} />
            <Route exact path="/signin" component={Signin} />
            <Route exact path="/signup" component={Signup} />
            <Route exact path="/recuperacion-password" component={Recuperacion} />
            <Route exact path="/profile" component={Profile} />
            <Route exact path="/rols" component={Rol} />
            <Route exact path="/permisos" component={Permisos} />
            <Route exact path="/action-users" component={ActionUsers} />
            <Route exact path="/products" component={Product} />
            <Route exact path="/personas" component={Personas} />
            <Route exact path="/equipos" component={Equipos} />
            <Route exact path="/mantenimiento" component={Mantenimiento} />
            <Route exact path="/clases" component={Clases} />
            <Route exact path="/reservas" component={Reservas} />
            <Route exact path="/sucursales" component={Sucursales} />
            <Route exact path="/venta-producto" component={VentaProducto} />
            <Route exact path="/categoria-maquina" component={CategoriaMaquina} />
            <Route exact path="/registro-mantenimiento/:id" component={RegistroMantenimiento} />
            <Route exact path="/detalle-mantenimiento/:id" component={DetalleMantenimiento} />
          </Switch>
        </div>
      </Router>
    )
  }
}
