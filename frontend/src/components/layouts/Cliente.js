import React, { Component } from 'react'
import { NavLink, withRouter } from 'react-router-dom'

class Cliente extends Component {

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
                    <NavLink className="nav-link" to="/reservas">Reservas</NavLink>
                </li>
             
                <li className="nav-item">
                    <NavLink className="nav-link" to="#" onClick={this.handleLogout}>Salir</NavLink>
                </li>
            </ul>
        )
    }
}

export default withRouter(Cliente)