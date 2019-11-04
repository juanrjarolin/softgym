import React, { Component } from 'react'
import axios from 'axios';
import { NotificationContainer, NotificationManager } from 'react-notifications'
import jwt_decode from 'jwt-decode'
import Security from '../security/Security';

export default class Rol extends Component {

    constructor() {
        super()
        this.state = {
            name: '',
            rols: [],
            _id: '',
            editing: false,
            isLoading: false,
            showRegistro: false,
            showVisualizacion: false,
            showEdit: false,
            showDelete: false
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    componentDidMount() {
        try {
            var token = localStorage.getItem('usertoken')
            if (token) {
                //decodifica el token
                const decode = jwt_decode(token)
                if (decode.permisos.crearRol) {
                    this.setState({
                        showRegistro: true,
                        isLoading: true
                    })
                    //estable un headers por defecto con el token obtenido
                    axios.defaults.headers.common['Authorization'] = token
                    //se actualizan la lista del state
                }
                if (decode.permisos.visualizarRol) {
                    this.setState({
                        showVisualizacion: true,
                        isLoading: true
                    })
                    this.fetchRols()
                }
                if (decode.permisos.editarRol) {
                    this.setState({
                        showEdit: true,
                        isLoading: true
                    })
                }

                if (decode.permisos.eliminarRol) {
                    this.setState({
                        showDelete: true,
                        isLoading: true
                    })
                }
            } else {
                this.setState({
                    isLoading: false
                })
            }
        } catch (error) {
            this.setState({
                isLoading: false
            })
        }
    }

    async fetchRols() {
        try {
            await axios.get('http://localhost:4000/api/rols')
                .then(res => {
                    if (res.data.success === false) {
                        this.setState({
                            isLoading: false
                        })
                    } else {
                        this.setState({
                            rols: res.data,
                            isLoading: true
                        })
                    }
                })
                .catch(err => {
                    this.setState({
                        isLoading: false
                    })
                })
        } catch (error) {
            this.setState({
                isLoading: false
            })
        }
    }

    async editRol(id) {
        const res = await axios.get('http://localhost:4000/api/rols/' + id)
        this.setState({
            name: res.data.name,
            _id: res.data._id,
            editing: true
        })
    }

    async deleteRol(id) {
        await axios.delete('http://localhost:4000/api/rols/' + id)
            .then(res => {
                if (res.data.success) {
                    this.fetchRols()
                    NotificationManager.success(res.data.message, 'Registro')
                } else {
                    NotificationManager.error(res.data.message, 'Registro')
                }
            })
            .catch(err => {
                console.log('Error' + err)
            })
    }

    handleSubmit = async (e) => {
        e.preventDefault()
        const rol = {
            name: this.state.name
        }

        try {
            if (this.state.editing) {
                await axios.put('http://localhost:4000/api/rols/' + this.state._id, rol)
                    .then(res => {
                        if (res.data.success === false) {
                            NotificationManager.error(res.data.message, 'Actualización')
                        } else {
                            this.fetchRols();
                            this.setState({
                                name: '',
                                editing: false,
                                _id: ''
                            })
                            document.getElementById('form').reset();
                            NotificationManager.success(res.data.message, 'Actualización')
                        }
                    })
            } else {
                await axios.post('http://localhost:4000/api/rols', rol)
                    .then(res => {
                        if (res.data.success === false) {
                            //Este mensaje se mostrará solo si se logra truncar la validacion del frontend
                            //el backend tambien se encuentra validado
                            NotificationManager.error(res.data.message, 'Registro')
                        } else {
                            this.setState({
                                name: ''
                            })
                            this.fetchRols();
                            document.getElementById('form').reset();
                            NotificationManager.success('Registro realizado con éxito', 'Registro')
                        }
                    })
                    .catch(err => {
                        console.log(err)
                    })
            }
        } catch (error) {
            NotificationManager.error('Ha ocurrido un error', 'Error')
        }
    }

    render() {
        const { isLoading, showRegistro, showDelete, showEdit, showVisualizacion } = this.state

        const registro = (
            <div className="col-sm-4">
                <div className="card">
                    <div className="card-body">
                        <h5 className="card-title">Registro de roles</h5>
                        <form onSubmit={this.handleSubmit} id="form">
                            <div className="row">
                                <div className="form-group col-sm-12">
                                    <label htmlFor="name">Nombre del rol</label>

                                    <input type="text" minLength="3" maxLength="15" id="name" onChange={this.handleChange} name="name" className="form-control form-control-sm validate" required pattern="[A-Za-z]+" title="Ingresar en minúsculas: administrador/vendedor/cliente" autoComplete="off" value={this.state.name} placeholder="Ingrese el nombre del rol" />
                                </div>
                                <div className="form-group col-sm-12">
                                    <button type="submit" className="btn btn-primary btn-sm" name="action">Guardar</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )

        const visualizar = (
            <div className="col-sm-8">
                <div className="card">
                    <div className="card-header">Listado de roles</div>
                    <div className="card-body">
                        <table className="table table-sm table-hover table-dark">
                            <thead>
                                <tr>
                                    <th scope="col">Nombre</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    this.state.rols.map(rol => {
                                        return (
                                            <tr key={rol._id}>
                                                <td>{rol.name}</td>
                                                <td className="px-2">
                                                    {showEdit && <button className="btn btn-primary btn-sm">
                                                        <i className="material-icons" onClick={() => this.editRol(rol._id)}>edit</i>
                                                    </button>}
                                                    {showDelete && <button className="btn btn-danger btn-sm" style={{ margin: '4px' }}>
                                                        <i className="material-icons" onClick={() => this.deleteRol(rol._id)}>delete</i>
                                                    </button>}
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )
        if (isLoading) {
            return (
                <div className="container py-5">
                    <div className="row">
                        {showRegistro && registro}
                        {showVisualizacion && visualizar}
                    </div>
                    <NotificationContainer />
                </div>
            )
        } else {
            return (
                <Security />
            )
        }
    }
}
