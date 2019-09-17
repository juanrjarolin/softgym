import React, { Component } from 'react'
import axios from 'axios'
import { NotificationContainer, NotificationManager } from 'react-notifications'
import jwt_decode from 'jwt-decode'
import Security from '../security/Security'

export default class Equipo extends Component {
    constructor() {
        super()
        this.state = {
            nombre: '',
            cod_equipo: '',
            costo: '',
            descripcion: '',
            _id: '',
            editing: false,
            equipos: [],
            isLoading: false,
            showRegistro: false,
            showVisualizacion: false,
            showEdit: false,
            showDelete: false
        }
    }

    componentDidMount() {
        var token = localStorage.getItem('usertoken')
        if (token) {
            //decodifica el token
            const decode = jwt_decode(token)
            if (decode.permisos.crearMaquina) {
                this.setState({
                    showRegistro: true,
                    isLoading: true
                })
            }
            if (decode.permisos.visualizarMaquina) {
                this.setState({
                    showVisualizacion: true,
                    isLoading: true
                })
                this.fetchEquipos()
                //estable un headers por defecto con el token obtenido
                axios.defaults.headers.common['Authorization'] = token
            }
            if (decode.permisos.editarMaquina) {
                this.setState({
                    showEdit: true,
                    isLoading: true
                })
            }

            if (decode.permisos.eliminarMaquina) {
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

    async fetchEquipos() {
        try {
            const equipos = await axios.get('http://localhost:4000/api/equipos')
            this.setState({
                equipos: equipos.data,
                isLoading: true
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
        const equipo = {
            nombre: this.state.nombre,
            cod_equipo: this.state.cod_equipo,
            costo: this.state.costo,
            descripcion: this.state.descripcion
        }

        try {
            if (this.state.editing) {
                const result = await axios.put('http://localhost:4000/api/equipos/' + this.state._id, equipo)
                if (result.data.success) {
                    NotificationManager.success(result.data.message, 'Actualización')
                    this.setState({
                        nombre: '',
                        cod_equipo: '',
                        costo: '',
                        descripcion: '',
                        _id: '',
                        editing: false
                    })
                    this.fetchEquipos()
                    document.getElementById('form').reset()
                }
            } else {
                const result = await axios.post('http://localhost:4000/api/equipos', equipo)
                if (result.data.success === false) {
                    NotificationManager.error(result.data.message, 'Registro')
                } else {
                    NotificationManager.success(result.data.message, 'Registro')
                    this.setState({
                        nombre: '',
                        cod_equipo: '',
                        costo: '',
                        descripcion: ''
                    })
                    this.fetchEquipos()
                    document.getElementById('form').reset()
                }
            }
        } catch (error) {
            NotificationManager.error('Error', 'Registro')
        }

    }

    async editEquipo(id) {
        try {
            const equipo = await axios.get('http://localhost:4000/api/equipos/' + id)
            this.setState({
                nombre: equipo.data.nombre,
                cod_equipo: equipo.data.cod_equipo,
                costo: equipo.data.costo,
                descripcion: equipo.data.descripcion,
                _id: equipo.data._id,
                editing: true
            })
        } catch (error) {
            NotificationManager.error('Ha ocurrido un error', 'Registro')
        }
    }

    async deleteEquipo(id) {
        try {
            const result = await axios.delete('http://localhost:4000/api/equipos/' + id)
            if (result.data.success) {
                this.fetchEquipos()
                NotificationManager.success(result.data.message, 'Registro')
            }
        } catch (error) {
            NotificationManager.error('Ha ocurrido un error', 'Registro')
        }
    }

    render() {
        const { isLoading, showDelete, showEdit, showRegistro, showVisualizacion } = this.state

        const registro = (
            <div className="col-sm-4">
                <div className="card">
                    <div className="card-body">
                        <h5 className="card-title">Registro de máquinas</h5>
                        <form onSubmit={this.handleSubmit} id="form">
                            <div className="row">
                                <div className="form-group col-sm-10">
                                    <label htmlFor="nombre">Nombre</label>

                                    <input type="text" minLength="3" maxLength="15" onChange={this.handleChange} name="nombre" id="nombre" className="form-control form-control-sm validate" required pattern="[A-Za-z]+" title="Ingrese nombre del equipo" autoComplete="off" value={this.state.nombre} placeholder="Ingrese el nombre de la máquina" />

                                </div>
                                <div className="form-group col-sm-10">
                                    <label htmlFor="cod_equipo">Código del equipo</label>

                                    <input type="text" minLength="3" maxLength="15" onChange={this.handleChange} name="cod_equipo" id="cod_equipo" className="form-control form-control-sm validate" required pattern="[A-Za-z]+" title="Ingrese el codigo del equipo" autoComplete="off" value={this.state.cod_equipo} placeholder="Ingrese el código de la máquina" />

                                </div>
                                <div className="form-group col-sm-10">
                                    <label htmlFor="costo">Costo</label>

                                    <input type="number" onChange={this.handleChange} name="costo" id="costo" className="form-control form-control-sm validate" required pattern="[A-Za-z]+" title="Ingrese costo del equipo" autoComplete="off" value={this.state.costo} placeholder="Ingrese el costo de la máquina" />

                                </div>
                                <div className="form-group col-sm-10">
                                    <label htmlFor="descripcion">Descripción</label>
                                    <textarea className="form-control form-control-sm" name="descripcion" id="descripcion" onChange={this.handleChange} value={this.state.descripcion} placeholder="Agregue una descripción de la máquina"></textarea>

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
            <div className="col-sm-8">
                <div className="card">
                    <div className="card-header">Listado de Máquinas</div>
                    <div className="card-body">
                        <table className="table table-hover table-dark">
                            <thead>
                                <tr>
                                    <th scope="col">Nombre</th>
                                    <th scope="col">Código</th>
                                    <th scope="col">Costo(Gs.)</th>
                                    <th scope="col">Descripción</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    this.state.equipos.map(equipo => {
                                        return (
                                            <tr key={equipo._id}>
                                                <td>{equipo.nombre}</td>
                                                <td>{equipo.cod_equipo}</td>
                                                <td>{equipo.costo}</td>
                                                <td>{equipo.descripcion}</td>
                                                <td>
                                                    {showEdit && <button className="btn btn-primary btn-sm">
                                                        <i className="material-icons" onClick={() => this.editEquipo(equipo._id)}>edit</i>
                                                    </button>}
                                                    {showDelete && <button className="btn btn-danger btn-sm" style={{ margin: '4px' }}>
                                                        <i className="material-icons" onClick={() => this.deleteEquipo(equipo._id)}>delete</i>
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
