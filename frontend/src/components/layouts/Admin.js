import React, { Component } from 'react'
import M from 'materialize-css/dist/js/materialize.min.js'
import { NavLink, withRouter } from 'react-router-dom'

class Admin extends Component {

    componentDidMount() {
        let elems = document.querySelectorAll('.dropdown-trigger')
        M.Dropdown.init(elems)
    }

    handleLogout = (e) => {
        e.preventDefault();
        localStorage.removeItem('usertoken');
        this.props.history.push(`/`);
    }

    render() {
        return (
            <ul className="right hide-on-med-and-down" >
                <li className="active">
                    <NavLink to="/">Inicio</NavLink>
                </li>
                <li className="nav-item">
                    <NavLink to="#">Caja</NavLink>
                </li>
                <li className="nav-item">
                    <NavLink to="#">Compras</NavLink>
                </li>
                <li className="nav-item">
                    <NavLink to="#">Ventas</NavLink>
                </li>
                <li className="nav-item">
                    <NavLink to="/products">Productos</NavLink>
                </li>
                <li className="nav-item">
                    <NavLink exact className="dropdown-trigger" data-target="equipo_id" to="#">Equipos<i className="material-icons right">arrow_drop_down</i>
                    </NavLink>
                    <ul id="equipo_id" className="dropdown-content">
                        <li><NavLink to="/equipos">Máquinas</NavLink></li>
                        <li><NavLink to="/mantenimiento">Mantenimiento</NavLink></li>
                    </ul>
                </li>
                <li className="nav-item">
                    <NavLink exact className="dropdown-trigger" data-target="persona_id" to="#">Personas<i className="material-icons right">arrow_drop_down</i>
                    </NavLink>
                    <ul id="persona_id" className="dropdown-content">
                        <li><NavLink to="/clientes">Clientes</NavLink></li>
                        <li><NavLink to="/proveedores">Proveedores</NavLink></li>
                    </ul>
                </li>
                <li className="nav-item">
                    <NavLink exact className="dropdown-trigger" data-target="user_id" to="#">Usuarios<i className="material-icons right">arrow_drop_down</i>
                    </NavLink>
                    <ul id="user_id" className="dropdown-content">
                        <li><NavLink to="/signup">Usuarios</NavLink></li>
                        <li><NavLink to="/rols">Roles</NavLink></li>
                        <li><NavLink to="/action-users">Acciones</NavLink></li>
                    </ul>
                </li>
                <li className="nav-item">
                    <NavLink to="#" onClick={this.handleLogout}>Salir</NavLink>
                </li>
            </ul>
        )
    }
}

export default withRouter(Admin)