import React, { Component } from 'react'
import { NavLink, withRouter } from 'react-router-dom'

class Vendedor extends Component {

    handleLogout = (e) => {
        e.preventDefault();
        localStorage.removeItem('usertoken');
        this.props.history.push(`/`);
    }


    render() {
        return (
            <ul className="navbar-nav" >
                <li className="nav-item active">
                    <NavLink className="nav-link" to="/">Inicio</NavLink>
                </li>
                <li className="nav-item">
                    <NavLink className="nav-link" to="/sucursales">Sucursales</NavLink>
                </li>
                <li className="nav-item">
                    <NavLink className="nav-link" to="/products">Productos</NavLink>
                </li>
                <li className="nav-item">
                    <NavLink className="nav-link" to="/clases">Clases</NavLink>
                </li>
                <li className="nav-item">
                    <NavLink className="nav-link" to="/reservas">Reservas</NavLink>
                </li>
                <li className="nav-item dropdown">
                    <NavLink exact className="nav-link dropdown-toggle" role="button" data-toggle="dropdown" to="#" id="navbarDropdownMenuLink" aria-haspopup="true" aria-expanded="false">Equipos</NavLink>
                    <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                        <NavLink className="dropdown-item" to="/equipos">Máquinas</NavLink>
                        <NavLink className="dropdown-item" to="/mantenimiento">Mantenimiento</NavLink>
                    </div>
                </li>
                <li className="nav-item dropdown">
                    <NavLink exact className="nav-link dropdown-toggle" role="button" data-toggle="dropdown" to="#" id="navbarDropdownMenuLink" aria-haspopup="true" aria-expanded="false">Personas</NavLink>
                    <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                        <NavLink className="dropdown-item" to="/clientes">Clientes</NavLink>
                        <NavLink className="dropdown-item" to="/proveedores">Proveedores</NavLink>
                    </div>
                </li>
                
                <li className="nav-item">
                    <NavLink className="nav-link" to="#" onClick={this.handleLogout}>Salir</NavLink>
                </li>
            </ul>
        )
    }
}

export default withRouter(Vendedor)