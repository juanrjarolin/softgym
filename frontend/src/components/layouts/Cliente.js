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
             <ul className="right hide-on-med-and-down" >
                <li className="active">
                    <NavLink to="/">Inicio</NavLink>
                </li>
                <li className="nav-item">
                    <NavLink to="/clases">Clases</NavLink>
                </li>
                <li className="nav-item">
                    <NavLink to="/reservas">Reservas</NavLink>
                </li>
                <li className="nav-item">
                    <NavLink to="#" onClick={this.handleLogout}>Salir</NavLink>
                </li>
            </ul>
        )
    }
}

export default withRouter(Cliente)