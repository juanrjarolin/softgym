import React, { Component } from 'react'
import { Link } from 'react-router-dom'
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
                                            <th scope="col">Equipo</th>
                                            <th scope="col">Mantenimiento</th>
                                            <th scope="col">Fecha de mantenimiento</th>
                                            <th scope="col">Detalles</th>
                                            <th scope="col">Costo Fijo</th>
                                            <th scope="col">Costo Variable</th>
                                            <th scope="col">Costo Financiero</th>
                                            <th scope="col">Costo Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            this.state.mantenimientos.map((mant) => {
                                                return (
                                                    <tr key={mant._id}>
                                                        <td>{mant.equipo.nombre}</td>
                                                        <td>{mant.tipoMantenimiento}</td>
                                                        <td>{mant.fechaMantenimiento}</td>
                                                        <td>{mant.detalle}</td>
                                                        <td>{mant.costoFijo}</td>
                                                        <td>{mant.costoVariable}</td>
                                                        <td>{mant.costoFinanciero}</td>
                                                        <td>{mant.costoTotal}</td>
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
                <div className="row">
                    <div className="col-sm-12">
                        <nav aria-label="Page navigation example">
                            <ul className="pagination pagination-sm justify-content-center">
                                <li className="page-item disabled">
                                    <a class="page-link" href="#" tabindex="-1" aria-disabled="true">Atrás</a>
                                </li>
                                <li className="page-item"><a className="page-link" href="#">1</a></li>
                                <li className="page-item"><a className="page-link" href="#">2</a></li>
                                <li className="page-item"><a className="page-link" href="#">3</a></li>
                                <li className="page-item">
                                    <a className="page-link" href="#">Siguiente</a>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
                <div className="row py-3">
                    <div className="col-sm-12">
                        <Link to="/registro-mantenimiento" className="btn btn-danger btn-sm">Nuevo</Link>
                    </div>
                </div>
                <NotificationContainer />
            </div>
        )
    }
}