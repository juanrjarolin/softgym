import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { NotificationContainer, NotificationManager } from 'react-notifications'
import jwt_decode from 'jwt-decode'
import Security from '../security/Security'

export default class Mantenimiento extends Component {
    constructor(props) {
        super(props)
        this.state = {
            equipos: [],
            mantenimientos: [],
            equipo: '',
            detalles: [],
            editing: false,
            _id: '',
            isLoading: true,
            showRegistro: false,
            showVisualizacion: false,
            showEdit: false,
            showDelete: false
        }
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    componentDidMount() {
        this.fetchMantenimientos()
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
        this.props.history.push(`/registro-mantenimiento/${id}`)
    }

    async deleteMantenimiento(id) {
        try {
            const result = await axios.delete('http://localhost:4000/api/mantenimiento/' + id)
            if (result.data.success) {
                this.fetchMantenimientos()
                NotificationManager.success(result.data.message, 'Mantenimiento')
            }
        } catch (error) {
            console.log(error)
        }

    }

    async showDetalles(id){
        this.props.history.push(`/detalle-mantenimiento/${id}`)
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

        return (
            <div className="container py-5">
                <div className="row">
                    <div className="col-sm-12">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">Listado de Mantenimientos</h5>
                                <table className="table table-hover table-dark">
                                    <thead>
                                        <tr>
                                            <th scope="col">Mantenimiento</th>
                                            <th scope="col">Fecha de mantenimiento</th>
                                            <th scope="col">Proveedor</th>
                                            <th scope="col">Costo Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            this.state.mantenimientos.map((mant) => {
                                                return (
                                                    <tr key={mant._id}>
                                                        <td>{mant.tipoMantenimiento}</td>
                                                        <td>{mant.fecha}</td>
                                                        <td>{mant.proveedor.nombre + ' ' + mant.proveedor.apellido}</td>
                                                        <td>{mant.costoTotal}</td>
                                                        <td>
                                                            <button className="btn btn-success btn-sm">
                                                                <i className="material-icons" onClick={() => this.editMantenimiento(mant._id)}>
                                                                    edit
                                                                </i>
                                                            </button>
                                                            <button className="btn btn-danger btn-sm" style={{margin: '4px'}}>
                                                                <i className="material-icons" onClick={() => this.deleteMantenimiento(mant._id)}>
                                                                    delete
                                                                </i>
                                                            </button>
                                                            <button className="btn btn-primary btn-sm">
                                                                <i className="material-icons" onClick={() => this.showDetalles(mant._id)}>
                                                                    info
                                                                </i>
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
                <div className="row py-3">
                    <div className="col-sm-12">
                        <Link to="/registro-mantenimiento/nuevo" className="btn btn-danger btn-sm">Nuevo</Link>
                    </div>
                </div>
                <NotificationContainer />
            </div>
        )
    }
}