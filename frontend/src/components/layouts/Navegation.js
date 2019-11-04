import React, { Component } from 'react'
import { Link, withRouter, NavLink } from 'react-router-dom'
import jwt_decode from 'jwt-decode'

class Navbar extends Component {

    constructor(props) {
        super(props)
        this.state = {
            firstName: '',
            lastName: '',
            role: ''
        }
    }

    handleLogout = (e) => {
        e.preventDefault();
        localStorage.removeItem('usertoken');
        this.props.history.push(`/`);
    }

    render() {
        let muestraReserva = false
        let muestraProducto = false
        let muestraLogin = false
        let muestraInicio = false
        let muestraSalir = false
        let muestraUsuario = false
        let muestraUsuarios = false
        let muestraClase = false
        let muestraEquipos = false
        let muestraMantenimiento = false
        let muestraMaquina = false
        let muestraCategoriaMaquina = false
        let muestraPersonas = false
        let muestraCliente = false
        let muestraProveedor = false
        let muestraRol = false
        let muestraPermiso = false
        let muestraSucursal = false

        if (localStorage.usertoken) {
            const token = localStorage.usertoken
            const decode = jwt_decode(token)

            //se mostrará estos menus siempre
            muestraInicio = true
            muestraSalir = true

            if (decode.permisos.visualizarReserva) {
                muestraReserva = true
            }
            if (decode.permisos.visualizarSucursal) {
                muestraSucursal = true
            }
            if (decode.permisos.visualizarUsuario) {
                muestraUsuario = true
                muestraUsuarios = true
            }
            if (decode.permisos.visualizarRol) {
                muestraRol = true
                muestraUsuarios = true
            }
            if (decode.permisos.visualizarPermiso) {
                muestraPermiso = true
                muestraUsuarios = true
            }
            if (decode.permisos.visualizarProducto) {
                muestraProducto = true
            }
            if (decode.permisos.visualizarClase) {
                muestraClase = true
            }
            if (decode.permisos.visualizarMantenimiento) {
                muestraMantenimiento = true
                muestraEquipos = true
            }
            if (decode.permisos.visualizarMaquina) {
                muestraMaquina = true
                muestraEquipos = true
            }
            if (decode.permisos.visualizarCategoriaMaquina) {
                muestraCategoriaMaquina = true
                muestraEquipos = true
            }
            if (decode.permisos.visualizarMantenimiento) {
                muestraMantenimiento = true
            }
            if (decode.permisos.visualizarCliente) {
                muestraPersonas = true
            }
            if (decode.permisos.visualizarProveedor) {
                muestraPersonas = true
            }

        } else {
            muestraLogin = true
        }

        const liLogin = (
            <li className="nav-item">
                <NavLink className="nav-link" to="/signin">Iniciar sesión</NavLink>
            </li>
        )

        const liUsuario = (
            <li className="nav-item dropdown">
                <NavLink exact className="nav-link dropdown-toggle" role="button" data-toggle="dropdown" to="#" id="navbarDropdownMenuLink" aria-haspopup="true" aria-expanded="false">Usuarios</NavLink>
                <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                    {muestraUsuario && <NavLink className="dropdown-item" to="/signup">Registro</NavLink>}
                    {muestraRol && <NavLink className="dropdown-item" to="/rols">Roles</NavLink>}
                    {muestraPermiso && <NavLink className="dropdown-item" to="/permisos">Permisos</NavLink>}
                </div>
            </li>
        )

        const liEquipos = (
            <li className="nav-item dropdown">
                <NavLink exact className="nav-link dropdown-toggle" role="button" data-toggle="dropdown" to="#" id="navbarDropdownMenuLink" aria-haspopup="true" aria-expanded="false">Equipos</NavLink>
                <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                    {muestraMaquina && <NavLink className="dropdown-item" to="/equipos">Máquinas</NavLink>}
                    {muestraCategoriaMaquina && <NavLink className="dropdown-item" to="/categoria-maquina">Categoría de máquinas</NavLink>}
                    {muestraMantenimiento && <NavLink className="dropdown-item" to="/mantenimiento">Mantenimiento</NavLink>}
                </div>
            </li>
        )

        const liInicio = (
            <li className="nav-item active">
                <NavLink className="nav-link" to="/">Inicio</NavLink>
            </li>
        )

        const liSalir = (
            <li className="nav-item">
                <NavLink className="nav-link" to="#" onClick={this.handleLogout}>Salir</NavLink>
            </li>
        )

        const liPersonas = (
            <li className="nav-item dropdown">
                <NavLink className="nav-link" to="/personas">Personas</NavLink>
            </li>
        )

        const liProducto = (
            <li className="nav-item">
                <NavLink className="nav-link" to="/products">Productos</NavLink>
            </li>
        )

        const liReserva = (
            <li className="nav-item">
                <NavLink className="nav-link" to="/reservas">Reservas</NavLink>
            </li>
        )

        const liClase = (
            <li className="nav-item">
                <NavLink className="nav-link" to="/clases">Clases</NavLink>
            </li>
        )

        const liSucursal = (
            <li className="nav-item">
                <NavLink className="nav-link" to="/sucursales">Sucursales</NavLink>
            </li>
        )

        return (
            <div>
                <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: '#000f29' }}>
                    <div className="container">
                        <Link className="navbar-brand" to="/">SoftGym</Link>
                        <ul className="navbar-nav">
                            {muestraLogin && liLogin}
                            {muestraInicio && liInicio}
                            {muestraSucursal && liSucursal}
                            {muestraReserva && liReserva}
                            {muestraClase && liClase}
                            {muestraEquipos && liEquipos}
                            {muestraPersonas && liPersonas}
                            {muestraProducto && liProducto}
                            {muestraUsuarios && liUsuario}
                            {muestraSalir && liSalir}
                        </ul>
                    </div>
                </nav>
            </div>
        )
    }
}

export default withRouter(Navbar)