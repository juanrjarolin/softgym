import React, { Component } from 'react'
import axios from 'axios'
import { NotificationContainer, NotificationManager } from 'react-notifications'
import jwt_decode from 'jwt-decode'
import Security from '../security/Security'

export default class Sucursal extends Component {
    constructor() {
        super()
        this.state = {
            cod_sucursal: '',
            localidad: '',
            direccion: '',
            telefono: '',
            sucursales: [],
            editing: false,
            _id: '',
            isLoading: true,
            opciones: [],
            clases: []
        }
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleOptions = (e) => {
        this.setState({
            [e.target.name]: e.target.options
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
                this.fetchClases()
                this.fetchSucursales()

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

    async fetchClases() {
        try {
            await axios.get('http://localhost:4000/api/clases')
                .then(res => {
                    this.setState({
                        clases: res.data
                    })
                })
                .catch(err => {
                    NotificationManager.error('Ha ocurrido un error', 'Error')
                })
        } catch (error) {
            NotificationManager.error('Ha ocurrido un error', 'Error')
        }
    }

    async fetchSucursales() {
        try {
            const sucursales = await axios.get('http://localhost:4000/api/sucursales')
            this.setState({
                sucursales: sucursales.data,
                isLoading: true
            })
        } catch (error) {
            this.setState({
                isLoading: false
            })
        }
    }

    handleSubmit = async (e) => {
        e.preventDefault()
        const clases = []
        for (let i = 0; i < this.state.opciones.length; i++) {
            if (this.state.opciones[i].selected) {
                clases.push(this.state.opciones[i].value)
            }
        }

        const sucursal = {
            cod_sucursal: this.state.cod_sucursal,
            localidad: this.state.localidad,
            direccion: this.state.direccion,
            telefono: this.state.telefono,
            clases: clases
        }

        try {
            if (this.state.editing) {
                const result = await axios.put('http://localhost:4000/api/sucursales/' + this.state._id, sucursal)
                if (result.data.success) {
                    NotificationManager.success(result.data.message, 'Actualización')
                    this.setState({
                        cod_sucursal: '',
                        localidad: '',
                        direccion: '',
                        telefono: '',
                        _id: '',
                        editing: false,
                        opciones: []
                    })
                    this.fetchSucursales()
                    document.getElementById('form').reset()
                }
            } else {
                const result = await axios.post('http://localhost:4000/api/sucursales', sucursal)
                if (result.data.success === false) {
                    NotificationManager.error(result.data.message, 'Registro')
                } else {
                    this.setState({
                        cod_sucursal: '',
                        localidad: '',
                        direccion: '',
                        telefono: '',
                        opciones: []
                    })
                    this.fetchSucursales()
                    document.getElementById('form').reset()
                    NotificationManager.success(result.data.message, 'Registro')
                }
            }
        } catch (error) {
            NotificationManager.error('Error', 'Registro')
        }

    }

    async editSucursal(id) {
        try {
            const sucursal = await axios.get('http://localhost:4000/api/sucursales/' + id)
            this.setState({
                cod_sucursal: sucursal.data.cod_sucursal,
                localidad: sucursal.data.localidad,
                direccion: sucursal.data.direccion,
                telefono: sucursal.data.telefono,
                _id: sucursal.data._id,
                editing: true
            })
        } catch (error) {
            NotificationManager.error('Ha ocurrido un error', 'Registro')
        }
    }

    async deleteSucursal(id) {
        try {
            const result = await axios.delete('http://localhost:4000/api/sucursales/' + id)
            if (result.data.success) {
                this.fetchSucursales()
                NotificationManager.success(result.data.message, 'Registro')
            }
        } catch (error) {
            NotificationManager.error('Ha ocurrido un error', 'Registro')
        }
    }

    render() {
        const {isLoading} = this.state
        if(isLoading){
            return (
                <div className="container py-5">
                    <div className="row">
                        <div className="col-sm-4">
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title">Registro de sucursales</h5>
                                    <form onSubmit={this.handleSubmit} id="form">
                                        <div className="row">
                                            <div className="form-group col-sm-10">
                                                <label htmlFor="cod_sucursal">Código</label>
    
                                                <input type="text" id="cod_sucursal" name="cod_sucursal" title="Ingrese el código de sucursal" onChange={this.handleChange} minLength="3" maxLength="3" autoComplete="off" value={this.state.cod_sucursal} required className="form-control form-control-sm validate" placeholder="Ingrese código sucursal"/>
                                            </div>
                                            <div className="form-group col-sm-10">
                                                <label htmlFor="localidad">Localidad</label>
                                                <textarea className="form-control form-control-sm validate" name="localidad" id="localidad" onChange={this.handleChange} value={this.state.localidad} placeholder="Ingrese localidad"></textarea>
    
                                            </div>
                                            <div className="form-group col-sm-10">
                                                <label htmlFor="direccion">Dirección</label>
                                                <textarea className="form-control form-control-sm validate" name="direccion" id="direccion" onChange={this.handleChange} value={this.state.direccion} placeholder="Ingrese dirección sucursal" ></textarea>
                                            </div>
    
                                            <div className="form-group col-sm-10">
                                                <label htmlFor="telefono">Teléfono</label>
    
                                                <input type="text" minLength="3" maxLength="15" onChange={this.handleChange} name="telefono" id="telefono" className="form-control form-control-sm validate" required title="Ingrese el telefono" autoComplete="off" value={this.state.telefono} placeholder="Ingrese telefono sucursal"/>
                                            </div>
    
                                            <div className="form-group col-sm-10">
                                                <label htmlFor="opciones">Clases</label>
                                                <select multiple onChange={this.handleOptions}
                                                className="form-control form-control-sm" name="opciones" id="opciones">
                                                    {
                                                        this.state.clases.map(clase => {
                                                            return (
                                                                <option key={clase._id} value={clase._id}>{clase.nombre}</option>
                                                            )
                                                        })
                                                    }
                                                </select>
                                            </div>
                                            <div className="form-group col-sm-10">
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
                                <div className="card-header">Listado de sucursales</div>
                                <div className="card-body">
                                    <table className="table table-striped table-dark">
                                        <thead>
                                            <tr>
                                                <th scope="col">Código</th>
                                                <th scope="col">Localidad</th>
                                                <th scope="col">Direccion</th>
                                                <th scope="col">Teléfono</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                this.state.sucursales.map(sucursal => {
                                                    return (
                                                        <tr key={sucursal._id} className="white-text">
                                                            <td>{sucursal.cod_sucursal}</td>
                                                            <td>{sucursal.localidad}</td>
                                                            <td>{sucursal.direccion}</td>
                                                            <td>{sucursal.telefono}</td>
                                                            <td>
                                                                <button className="btn btn-primary btn-sm">
                                                                    <i className="material-icons" onClick={() => this.editSucursal(sucursal._id)}>edit</i>
                                                                </button>
                                                                <button className="btn btn-danger btn-sm" style={{ margin: '4px' }}>
                                                                    <i className="material-icons" onClick={() => this.deleteSucursal(sucursal._id)}>delete</i>
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
        }else{
            return (
                <Security />
            )
        }
    }
}
