import React, { Component } from 'react'
import { Link, withRouter, NavLink } from 'react-router-dom'
import jwt_decode from 'jwt-decode'
import Admin from './Admin'

class Navbar extends Component {

    constructor(props) {
        super(props)
        this.state = {
            firstName: '',
            lastName: '',
            role: ''
        }
    }

    render() {
        let navUser
        const navLogin = (
            <ul className="right hide-on-med-and-down">
                <li className="nav-item">
                    <NavLink to="/signin">Iniciar sesión</NavLink>
                </li>
            </ul>
        )

        //Decodifica el token para mostrar los menús de acuerdo al rol
        if (localStorage.usertoken) {
            const token = localStorage.usertoken
            const decode = jwt_decode(token)
            switch (decode.role) {
                case "administrador":
                    navUser = <Admin />
                    break;
                default:
                    navUser = navLogin
                    break;
            }
        } else {
            navUser = navLogin
        }

        return (
            <div className="navbar-fixed">
                <nav className="grey darken-4">
                    <div className="nav-wrapper container">
                        <Link className="brand-logo" to="/">SoftGym</Link>
                        {navUser}
                    </div>
                </nav>
            </div>
        )
    }
}

export default withRouter(Navbar)