import React, { Component } from 'react'
import { Link, withRouter, NavLink } from 'react-router-dom'
import jwt_decode from 'jwt-decode'
import Admin from './Admin'
import Cliente from './Cliente'
import Vendedor from './Vendedor'

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
            <ul className="navbar-nav">
                <li className="nav-item">
                    <NavLink className="nav-link" to="/signin">Iniciar sesión</NavLink>
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
                case "cliente":
                    navUser = <Cliente />
                    break;
                case "vendedor":
                    navUser = <Vendedor />
                    break;
                default:
                    navUser = navLogin
                    break;
            }
        } else {
            navUser = navLogin
        }

        return (
            <div>
                <nav className="navbar navbar-expand-lg navbar-dark" style={{backgroundColor: '#000f29'}}>
                    <div className="container">
                        <Link className="navbar-brand" to="/">SoftGym</Link>
                        {navUser}
                    </div>
                </nav>
            </div>
        )
    }
}

export default withRouter(Navbar)