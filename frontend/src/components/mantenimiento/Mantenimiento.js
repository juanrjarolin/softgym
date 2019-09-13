import React, { Component } from 'react'
import axios from 'axios'
import { NotificationContainer, NotificationManager } from 'react-notifications'
import jwt_decode from 'jwt-decode'
import Security from '../security/Security'

export default class Mantenimiento extends Component {
    constructor() {
        super()
        this.state = {
            equipos: [],
            mantenimientos: [],
            equipo: '',
            detalles: '',
            editing: false,
            _id: '',
            isLoading: true
        }
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    componentDidMount() {
        var token = localStorage.getItem('usertoken')
        if (token) {
            //decodifica el token
            const decode = jwt_decode(token)
            if (decode.role === 'administrador' || decode.role === "vendedor") {
                //estable un headers por defecto con el token obtenido
                axios.defaults.headers.common['Authorization'] = token

                //se actualizan las listas del state
                this.fetchEquipos()
                this.fetchMantenimientos()

            } else {
                this.setState({
                    isLoading: false
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
            const result = await axios.get('http://localhost:4000/api/equipos')
            this.setState({
                equipos: result.data
            })
        } catch (error) {
            console.log(error)
        }
    }

    async fetchMantenimientos() {
        try {
            const result = await axios.get('http://localhost:4000/api/mantenimiento')
            this.setState({
                mantenimientos: result.data
            })
        } catch (error) {
            console.log(error)
        }
    }

    async editMantenimiento(id) {
        try {
            const result = await axios.get('http://localhost:4000/api/mantenimiento/' + id)
            this.setState({
                equipo: result.data.equipo._id,
                detalles: result.data.detalleMantenimiento,
                _id: result.data._id,
                editing: true
            })
        } catch (error) {
            console.log(error)
        }
    }

    async deleteMantenimiento(id) {
        try {
            const result = await axios.delete('http://localhost:4000/api/mantenimiento/' + id)
            if (result.data.success) {
                this.fetchMantenimientos()
                NotificationManager.success(result.data.message, 'Registro')
            }
        } catch (error) {
            console.log(error)
        }

    }

    async completarMantenimiento(id) {
        try {
            const result = await axios.put('http://localhost:4000/api/mantenimiento/completar/' + id)
            if (result.data.success) {
                this.fetchMantenimientos()
                NotificationManager.success(result.data.message, 'Mantenimiento')
            } else {
                NotificationManager.error(result.data.message, 'Mantenimiento')
            }
        } catch (error) {
            console.log(error)
        }
    }

    handleSubmit = async (e) => {
        e.preventDefault()
        const newMantenimiento = {
            equipo: this.state.equipo,
            detalleMantenimiento: this.state.detalles
        }
        try {
            if (this.state.editing) {
                const result = await axios.put('http://localhost:4000/api/mantenimiento/' + this.state._id, newMantenimiento)
                if (result.data.success === false) {
                    NotificationManager.error(result.data.message, 'Actualización')
                } else {
                    NotificationManager.success(result.data.message, 'Actualización')
                    this.setState({
                        equipo: '',
                        detalles: '',
                        _id: '',
                        editing: false
                    })
                    this.fetchMantenimientos()
                    document.getElementById('form').reset()
                }
            } else {
                const result = await axios.post('http://localhost:4000/api/mantenimiento', newMantenimiento)
                if (result.data.success === false) {
                    NotificationManager.error(result.data.message, 'Registro')
                } else {
                    this.setState({
                        equipo: '',
                        detalles: ''
                    })
                    this.fetchMantenimientos()
                    document.getElementById('form').reset()
                    NotificationManager.success(result.data.message, 'Registro')
                }
            }
        } catch (error) {
            NotificationManager.error('Ha ocurrido un error', 'Registro')
        }
    }

    render() {
        const { isLoading } = this.state
        if (isLoading) {
            const { equipos } = this.state
            let opciones = equipos.map((equipo) =>
                <option key={equipo._id} value={equipo._id}>{equipo.nombre}</option>
            )
            return (
                <div className="container py-5">
                    <div className="row">
                        <div className="col-sm-4">
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title">Equipos</h5>
                                    <form onSubmit={this.handleSubmit} id="form">
                                        <div className="row">
                                            <div className="form-group col-sm-10">
                                                <select className="form-control form-control-sm" name="equipo" onChange={this.handleChange}>
                                                    <option defaultValue>Seleccione un equipo</option>
                                                    {
                                                        opciones
                                                    }
                                                </select>
                                            </div>
                                            <div className="form-group col-sm-10">
                                                <label htmlFor="detalles">Detalles</label>
                                                <textarea className="form-control form-control-sm validate" name="detalles" id="detalles" onChange={this.handleChange} value={this.state.detalles} placeholder="Agregue una descripción del mantenimiento" ></textarea>
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
                        <div className="col-sm-8">
                            <div className="card">
                                <div className="card-header">Listado de Mantenimientos</div>
                                <div className="card-body">
                                    <table className="table table-hover table-dark">
                                        <thead>
                                            <tr>
                                                <th scope="col">Equipo</th>
                                                <th scope="col">Detalles</th>
                                                <th scope="col">Estado</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                this.state.mantenimientos.map((mant) => {
                                                    return (
                                                        <tr key={mant._id}>
                                                            <td>{mant.equipo.nombre}</td>
                                                            <td>{mant.detalleMantenimiento}</td>
                                                            <td>{mant.estado}</td>
                                                            <td>
                                                                <button className="btn btn-primary btn-sm">
                                                                    <i className="material-icons" onClick={() => this.editMantenimiento(mant._id)}>edit</i>
                                                                </button>
                                                                <button className="btn btn-danger btn-sm" style={{ margin: '4px' }}>
                                                                    <i className="material-icons" onClick={() => this.deleteMantenimiento(mant._id)}>delete</i>
                                                                </button>
                                                                <button title="Completar mantenimiento" className="btn btn-success btn-sm" style={{ margin: '4px' }}>
                                                                    <i className="material-icons" onClick={() => this.completarMantenimiento(mant._id)}>check</i>
                                                                </button>
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