import React, { Component } from 'react'
import axios from 'axios'
import { NotificationContainer, NotificationManager } from 'react-notifications'
import jwt_decode from 'jwt-decode'
import Security from '../security/Security'

export default class Personas extends Component {

    constructor() {
        super()
        this.state = {
            nombre: '',
            apellido: '',
            direccion: '',
            telefono: '',
            cedula: '',
            correo: '',
            tipo_persona: '',
            ruc: '',
            _id: '',
            personas: [],
            es_cliente: '',
            es_proveedor: '',
            editing: false,
            isLoading: false,
            showRegistro: false,
            showEdit: false,
            showVisualizacion: false,
            showDelete: false
        }
    }

    componentDidMount() {
        var token = localStorage.getItem('usertoken')
        if (token) {
            //decodifica el token
            const decode = jwt_decode(token)
            if (decode.permisos.crearProveedor) {
                this.setState({
                    showRegistro: true,
                    isLoading: true
                })

            }

            if (decode.permisos.crearCliente) {
                this.setState({
                    showRegistro: true,
                    isLoading: true
                })

            }

            if (decode.permisos.visualizarProveedor) {
                this.setState({
                    showVisualizacion: true,
                    isLoading: true
                })
                this.fetchPersonas()
                //estable un headers por defecto con el token obtenido
                axios.defaults.headers.common['Authorization'] = token
            }

            if (decode.permisos.visualizarCliente) {
                this.setState({
                    showVisualizacion: true,
                    isLoading: true
                })
                this.fetchPersonas()
                //estable un headers por defecto con el token obtenido
                axios.defaults.headers.common['Authorization'] = token
            }

            if (decode.permisos.editarProveedor) {
                this.setState({
                    showEdit: true,
                    isLoading: true
                })
            }

            if (decode.permisos.editarCliente) {
                this.setState({
                    showEdit: true,
                    isLoading: true
                })
            }

            if (decode.permisos.eliminarProveedor) {
                this.setState({
                    showDelete: true,
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

    async fetchPersonas() {
        try {
            await axios.get('http://localhost:4000/api/personas')
                .then(res => {
                    if (res.data.success === false) {
                        this.setState({
                            isLoading: false
                        })
                    } else {
                        this.setState({
                            personas: res.data,
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

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleSubmit = async (e) => {
        e.preventDefault()
        
        const persona = {
            nombre: this.state.nombre,
            apellido: this.state.apellido,
            cedula: this.state.cedula,
            direccion: this.state.direccion,
            telefono: this.state.telefono,
            correo: this.state.correo,
            es_cliente: this.state.es_cliente,
            es_proveedor: this.state.es_proveedor,
            tipo_persona: this.state.tipo_persona,
            ruc: this.state.ruc
        }

        if (this.state.editing) {
            await axios.put('http://localhost:4000/api/personas/' + this.state._id, persona)
            this.fetchPersonas();
            this.setState({
                nombre: '',
                apellido: '',
                cedula: '',
                direccion: '',
                telefono: '',
                correo: '',
                es_cliente: false,
                es_proveedor: false,
                tipo_persona: '',
                ruc: '',
                _id: '',
                editing: false
            })
            document.getElementById('form').reset();
            NotificationManager.success('Actualización realizada con éxito', 'Registro')
        } else {
            await axios.post('http://localhost:4000/api/personas', persona)
                .then(res => {
                    if (res.data.success === false) {
                        //Este mensaje se mostrará solo si se logra truncar la validacion del frontend
                        //el backend tambien se encuentra validado
                        NotificationManager.error(res.data.message, 'Registro')
                    } else {
                        this.setState({
                            nombre: '',
                            apellido: '',
                            cedula: '',
                            direccion: '',
                            telefono: '',
                            correo: '',
                            es_proveedor: false,
                            es_cliente: false,
                            ruc: '',
                            tipo_persona: ''
                        })
                        this.fetchPersonas();
                        document.getElementById('form').reset();
                        NotificationManager.success('Registro realizado con éxito', 'Registro')
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        }
    }

    handleRadio = (e) => {
        if (e.target.value === "Cliente") {
            this.setState({
                es_cliente: true,
                es_proveedor: false
            })
        } else {
            this.setState({
                es_cliente: false,
                es_proveedor: true
            })
        }
    }

    async editPersona(id) {
        const res = await axios.get('http://localhost:4000/api/personas/' + id)
        this.setState({
            nombre: res.data.nombre,
            apellido: res.data.apellido,
            cedula: res.data.cedula,
            direccion: res.data.direccion,
            telefono: res.data.telefono,
            correo: res.data.correo,
            es_cliente: res.data.es_cliente,
            es_proveedor: res.data.es_proveedor,
            tipo_persona: res.data.tipo_persona,
            ruc: res.data.ruc,
            _id: res.data._id,
            editing: true
        })
    }

    async deletePersona(id) {
        await axios.delete('http://localhost:4000/api/personas/' + id)
            .then(res => {
                if (res.data.success) {
                    this.fetchPersonas()
                    NotificationManager.success(res.data.message, 'Registro')
                }
            })
            .catch(err => {
                console.log('Error' + err)
            })
    }

    render() {
        const { isLoading, showDelete, showEdit, showRegistro, showVisualizacion } = this.state

        const registro = (
            <div className="col-sm-4">
                <div className="card">
                    <div className="card-body">
                        <h5 className="card-title">Registro de Personas</h5>
                        <form onSubmit={this.handleSubmit} id="form">
                            <div className="row">
                                <div className="form-group col-sm-10">
                                    <select className="form-control form-control-sm" name="tipo_persona" onChange={this.handleChange}>
                                        <option defaultValue>Tipo de persona</option>
                                        <option value="Jurídica">Jurídica</option>
                                        <option value="Física">Física</option>
                                    </select>
                                </div>
                                <div className="form-group col-sm-10">
                                    <label htmlFor="nombre">Nombre</label>

                                    <input type="text" minLength="3" maxLength="15" onChange={this.handleChange} name="nombre" id="nombre" className="form-control form-control-sm validate" required pattern="[A-Za-z]+" title="Ingrese nombre de la persona" autoComplete="off" value={this.state.nombre} placeholder="Ingrese el nombre" />

                                </div>
                                <div className="form-group col-sm-10">
                                    <label htmlFor="apellido">Apellido</label>

                                    <input type="text" minLength="3" maxLength="15" onChange={this.handleChange} name="apellido" id="apellido" className="form-control form-control-sm validate" pattern="[A-Za-z]+" title="Ingrese el apellido de la persona" autoComplete="off" value={this.state.apellido} placeholder="Ingrese el apellido" />

                                </div>
                                <div className="form-group col-sm-10">
                                    <label htmlFor="direccion">Dirección</label>

                                    <input type="text" minLength="3" maxLength="15" onChange={this.handleChange} name="direccion" id="direccion" className="form-control form-control-sm validate" required title="Ingrese la dirección de la persona" autoComplete="off" value={this.state.direccion} placeholder="Ingrese la dirección" />

                                </div>
                                <div className="form-group col-sm-10">
                                    <label htmlFor="cedula">Cédula</label>

                                    <input type="number" minLength="3" maxLength="15" onChange={this.handleChange} name="cedula" id="cedula" className="form-control form-control-sm validate" title="Ingrese cedula de la persona" autoComplete="off" value={this.state.cedula} placeholder="Ingrese la cédula" />

                                </div>
                                <div className="form-group col-sm-10">
                                    <label htmlFor="ruc">RUC</label>

                                    <input type="text" minLength="3" maxLength="15" onChange={this.handleChange} name="ruc" id="ruc" className="form-control form-control-sm validate" title="Ingrese el ruc de la persona" autoComplete="off" value={this.state.ruc} placeholder="Ingrese el ruc" />

                                </div>
                                <div className="form-group col-sm-10">
                                    <label htmlFor="telefono">Teléfono</label>
                                    <input type="number" minLength="3" maxLength="15" onChange={this.handleChange} name="telefono" id="telefono" className="form-control form-control-sm validate" required title="Ingrese telefono" autoComplete="off" value={this.state.telefono} placeholder="Ingrese el teléfono" />

                                </div>
                                <div className="form-group col-sm-10">
                                    <label htmlFor="correo">Correo</label>

                                    <input type="email" onChange={this.handleChange} name="correo" id="correo" className="form-control form-control-sm validate" required title="Ingrese correo electrónico" autoComplete="off" value={this.state.correo} placeholder="Ingrese correo electrónico" />

                                </div>
                                <div className="form-group col-sm-10">
                                    <div className="form-check">
                                        <input className="form-check-input" type="radio" value="Cliente" id="defaultCheck1" name="tipo" onChange={this.handleRadio}/>
                                        <label className="form-check-label" htmlFor="defaultCheck1">
                                            Cliente
                                        </label>
                                    </div>
                                    <div className="form-check">
                                        <input className="form-check-input" type="radio" value="Proveedor" id="defaultCheck2" name="tipo" onChange={this.handleRadio}/>
                                        <label className="form-check-label" htmlFor="defaultCheck2">
                                            Proveedor
                                        </label>
                                    </div>
                                </div>
                                <div className="form-group col-sm-12">
                                    <button type="submit" className="btn btn-primary btn-sm" name="action">Guardar
                                                </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )

        const visualizar = (
            <div className="col-md-8">
                <div className="card">
                    <div className="card-body">
                        <h5 className="card-title">Listado de Personas</h5>
                        <table className="table table-hover table-dark">
                            <thead>
                                <tr>
                                    <th scope="col">Nombre</th>
                                    <th scope="col">Cédula</th>
                                    <th scope="col">Dirección</th>
                                    <th scope="col">Teléf.</th>
                                    <th scope="col">Correo</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    this.state.personas.map(persona => {
                                        return (
                                            <tr key={persona._id}>
                                                <td>{persona.nombre + " " + persona.apellido}</td>
                                                <td>{persona.cedula}</td>
                                                <td>{persona.direccion}</td>
                                                <td>{persona.telefono}</td>
                                                <td>{persona.correo}</td>
                                                <td>
                                                    {showEdit && <button className="btn btn-primary btn-sm">
                                                        <i className="material-icons" onClick={() => this.editPersona(persona._id)}>edit</i>
                                                    </button>}
                                                    {showDelete && <button className="btn btn-danger btn-sm" style={{ margin: '4px' }}>
                                                        <i className="material-icons" onClick={() => this.deletePersona(persona._id)}>delete</i>
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