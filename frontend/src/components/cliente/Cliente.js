import React, { Component } from 'react'
import axios from 'axios'
import { NotificationContainer, NotificationManager } from 'react-notifications'
import jwt_decode from 'jwt-decode'
import Security from '../security/Security'

export default class Cliente extends Component {
    constructor() {
        super()
        this.state = {
            tipoPersona: '',
            name: '',
            direccion: '',
            cedula: '',
            telefono: '',
            isLoading: false,
            _id: '',
            clientes: [],
            editing: false,
            showRegistro: false,
            showEdit: false,
            showDelete: false,
            showVisualizacion: false
        }
    }
    componentDidMount() {
        var token = localStorage.getItem('usertoken')
        if (token) {
            //decodifica el token
            const decode = jwt_decode(token)
            if (decode.permisos.crearCliente) {
                this.setState({
                    showRegistro: true,
                    isLoading: true
                })
            }
            if (decode.permisos.visualizarCliente) {
                this.setState({
                    showVisualizacion: true,
                    isLoading: true
                })
                this.fetchClientes()
                //estable un headers por defecto con el token obtenido
                axios.defaults.headers.common['Authorization'] = token
            }
            if (decode.permisos.editarCliente) {
                this.setState({
                    showEdit: true,
                    isLoading: true
                })
            }

            if (decode.permisos.eliminarCliente) {
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
    }

    async fetchClientes() {
        try {
            const clientes = await axios.get('http://localhost:4000/api/cliente')
            this.setState({
                clientes: clientes.data
            })
        } catch (error) {
            this.setState({
                isLoading: false
            })
        }
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    async editCliente(id) {
        try {
            const cliente = await axios.get('http://localhost:4000/api/cliente/' + id)
            this.setState({
                tipoPersona: cliente.data.tipoPersona,
                name: cliente.data.name,
                direccion: cliente.data.direccion,
                cedula: cliente.data.cedula,
                telefono: cliente.data.telefono,
                _id: cliente.data._id,
                editing: true
            })
        } catch (error) {
            console.log('error')
        }
    }

    async deleteCliente(id) {
        try {
            const res = await axios.delete('http://localhost:4000/api/cliente/' + id)
            if (res.data.success === true) {
                this.fetchClientes()
                NotificationManager.success(res.data.message, 'Cliente')
            }
        } catch (error) {
            console.log('Error')
        }
    }

    handleSubmit = async (e) => {
        e.preventDefault()
        const cliente = {
            tipoPersona: this.state.tipoPersona,
            name: this.state.name,
            direccion: this.state.direccion,
            cedula: this.state.cedula,
            telefono: this.state.telefono
        }
        try {
            if (this.state.editing) {
                await axios.put('http://localhost:4000/api/cliente/' + this.state._id, cliente)
                this.fetchClientes()
                this.setState({
                    tipoPersona: '',
                    name: '',
                    direccion: '',
                    cedula: '',
                    telefono: '',
                    _id: '',
                    editing: false
                })
                document.getElementById('form').reset();
                NotificationManager.success('Actualización realizada con éxito', 'Registro')
            } else {
                const res = await axios.post('http://localhost:4000/api/cliente', cliente)
                if (res.data.success === false) {
                    NotificationManager.error(res.data.message, 'Registro')
                } else {
                    this.setState({
                        tipoPersona: '',
                        name: '',
                        direccion: '',
                        cedula: '',
                        telefono: ''
                    })
                    this.fetchClientes()
                    document.getElementById('form').reset();
                    NotificationManager.success(res.data.message, 'Registro')
                }
            }
        }
        catch (error) {
            console.log('Error')

        }
    }
    render() {
        const { isLoading, showDelete, showEdit, showRegistro, showVisualizacion } = this.state

        const registro = (
            <div className="col-sm-4">
                <div className="card">
                    <div className="card-body">
                        <h5 className="card-title">Registro de Clientes</h5>
                        <form onSubmit={this.handleSubmit} id="form">
                            <div className="row">
                                <div className="form-group col-sm-10">
                                    <label htmlFor="tipoPersona">Tipo Persona</label>

                                    <input type="text" minLength="2" maxLength="15" id="tipoPersona" onChange={this.handleChange} name="tipoPersona" className="form-control form-control-sm" required pattern="[A-Za-z]+" title="Se requiere caracteres alfabéticos min: 3 y máx: 15" autoComplete="off" value={this.state.tipoPersona} placeholder="Ingrese tipo de persona" />
                                </div>

                                <div className="form-group col-sm-10">
                                    <label htmlFor="name">Nombre</label>

                                    <input type="text" id="name" onChange={this.handleChange} name="name" className="form-control form-control-sm" required pattern="[A-Za-z]+" title="Se requiere caracteres alfabéticos min: 3 y máx: 15" autoComplete="off" value={this.state.name} placeholder="Ingrese el nombre del cliente" />
                                </div>
                                <div className="form-group col-sm-10">
                                    <label htmlFor="cedula">Cedula</label>

                                    <input type="text" id="cedula" onChange={this.handleChange} name="cedula" className="form-control form-control-sm" title="Se requiere caracteres alfabéticos min: 3 y máx: 15" autoComplete="off" value={this.state.cedula} placeholder="Ingrese la cédula del cliente" />

                                </div>
                                <div className="form-group col-sm-10">
                                    <label htmlFor="direccion">Direccion</label>

                                    <input type="text" id="direccion" onChange={this.handleChange} name="direccion" className="form-control form-control-sm" required pattern="[A-Za-z]+" title="Se requiere caracteres alfabéticos min: 3 y máx: 15" autoComplete="off" value={this.state.direccion} placeholder="Ingrese dirección del cliente" />

                                </div>
                                <div className="form-group col-sm-10">
                                    <label htmlFor="telefono">Telefono</label>

                                    <input type="text" id="telefono" onChange={this.handleChange} name="telefono" className="form-control form-control-sm" title="Se requiere caracteres alfabéticos min: 3 y máx: 15" autoComplete="off" value={this.state.telefono} placeholder="Ingrese el telefono del cliente" />

                                </div>
                                <div className="form-group col-sm-10">
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
                    <div className="card-body">
                        <h5 className="card-title">Clientes</h5>
                        <table className="table table-hover table-dark">
                            <thead>
                                <tr>
                                    <th>Tipo Persona</th>
                                    <th>Nombre</th>
                                    <th>Cedula</th>
                                    <th>Direccion</th>
                                    <th>Telefono</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    this.state.clientes.map(cliente => {
                                        return (
                                            <tr key={cliente._id}>
                                                <td>{cliente.tipoPersona}</td>
                                                <td>{cliente.name}</td>
                                                <td>{cliente.cedula}</td>
                                                <td>{cliente.direccion}</td>
                                                <td>{cliente.telefono}</td>
                                                <td>
                                                    {showEdit && <button className="btn btn-primary btn-sm">
                                                        <i className="material-icons" onClick={() => this.editCliente(cliente._id)}>edit</i>
                                                    </button>}
                                                    {showDelete && <button className="btn btn-danger btn-sm" style={{ margin: '4px' }}>
                                                        <i className="material-icons" onClick={() => this.deleteCliente(cliente._id)}>delete</i>
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

