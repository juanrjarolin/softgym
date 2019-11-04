import React, { Component } from 'react'
import axios from 'axios'
import { NotificationContainer, NotificationManager } from 'react-notifications'
import jwt_decode from 'jwt-decode'
import Security from '../security/Security'

export default class Clases extends Component {
    constructor() {
        super()
        this.state = {
            nombre: '',
            dias: '',
            hora: '',
            cantidad: '',
            actual: 0,
            clases: [],
            _id: '',
            editing: false,
            isLoading: true
        }
    }

    componentDidMount() {
        /*
        document.addEventListener('DOMContentLoaded', function () {
            var horario = ""
            var inputHorario = ""
            var elems = document.querySelectorAll('.timepicker')
            M.Timepicker.init(elems, {
                defaultTime: '00:00',
                twelveHour: false,
                onSelect: function (hora, minuto) {
                    horario = hora + ':' + minuto + 'hs.'
                    inputHorario = document.getElementById('hora')
                    inputHorario.value = horario
                },
                onCloseEnd: function () {
                    if (!horario) {
                        inputHorario = document.getElementById('hora')
                        inputHorario.value = "No definido"
                    }
                }
            })
        });
        M.AutoInit()*/
        var token = localStorage.getItem('usertoken')
        if (token) {
            //decodifica el token
            const decode = jwt_decode(token)
            if (decode.role === 'administrador' || decode.role === "vendedor") {
                //estable un headers por defecto con el token obtenido
                axios.defaults.headers.common['Authorization'] = token

                //se actualizan las listas del state
                this.fetchClases()

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
            const result = await axios.get('http://localhost:4000/api/clases')
            this.setState({
                clases: result.data
            })
        } catch (error) {
            NotificationManager.error('Ha ocurrido un error', 'Error')
        }
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    /*
    handleOptions = (e) => {
        this.setState({
            [e.target.name]: e.target.options
        })
    }*/

    handleSubmit = async (e) => {
        e.preventDefault()
        /*
        const dias = []
        for (let i = 0; i < this.state.opciones.length; i++) {
            if (i === 0) {
                continue
            } else {
                if (this.state.opciones[i].selected) {
                    dias.push(this.state.opciones[i].value)
                }
            }
        }*/
        const horario = document.getElementById('hora').value

        const clase = {
            nombre: this.state.nombre,
            cantidadPersona: this.state.cantidad,
            dias: this.state.dias,
            horario: horario,
            cantidadActual: document.getElementById('actual').value
        }

        try {
            if (this.state.editing) {
                const result = await axios.put('http://localhost:4000/api/clases/' + this.state._id, clase)
                if (result.data.success) {
                    this.setState({
                        nombre: '',
                        cantidad: '',
                        hora: '',
                        dias: '',
                        _id: '',
                        actual: 0,
                        editing: false
                    })
                    this.fetchClases()
                    document.getElementById('form').reset()
                    NotificationManager.success(result.data.message, 'Registro de clase')
                } else {
                    NotificationManager.error(result.data.message, 'Registro de clase')
                }
            } else {
                const result = await axios.post('http://localhost:4000/api/clases', clase)
                if (result.data.success) {
                    this.setState({
                        nombre: '',
                        cantidad: '',
                        hora: '',
                        dias: '',
                        actual: 0
                    })
                    this.fetchClases()
                    document.getElementById('form').reset()
                    NotificationManager.success(result.data.message, 'Registro de clase')
                } else {
                    NotificationManager.error(result.data.message, 'Registro de clase')
                }
            }
        } catch (error) {

        }

    }

    async editClase(id) {
        try {
            const result = await axios.get('http://localhost:4000/api/clases/' + id)
            this.setState({
                nombre: result.data.nombre,
                _id: result.data._id,
                cantidad: result.data.cantidadPersona,
                dias: result.data.dias,
                actual: result.data.cantidadActual,
                editing: true
            })
            document.getElementById('hora').value = result.data.horario
        } catch (error) {
            NotificationManager.error('Ha ocurrido un error', 'Error')
        }
    }

    async deleteClase(id) {
        try {
            const result = await axios.delete('http://localhost:4000/api/clases/' + id)
            if (result.data.success) {
                this.fetchClases()
                NotificationManager.success(result.data.message, 'Eliminación de Clase')
            }
        } catch (error) {
            NotificationManager.error('Ha ocurrido un error', 'Error')
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
                                    <h5 className="card-title white-text">Clases</h5>
                                    <form onSubmit={this.handleSubmit} id="form">
                                        <div className="row">
                                            <div className="form-group col-sm-10">
                                                <label htmlFor="nombre">Nombre</label>
    
                                                <input type="text" minLength="3" maxLength="15" onChange={this.handleChange} name="nombre" id="nombre" className="form-control form-control-sm validate" required pattern="[A-Za-z]+" title="Ingrese nombre de la clase" autoComplete="off" value={this.state.nombre}  placeholder="Ingrese el nombre de la clase"/>
                                            </div>
                                            <div className="form-group col-sm-10">
                                                <label htmlFor="dias">Días de clase</label>
                                                <textarea className="form-control form-control-sm validate" name="dias" id="dias" onChange={this.handleChange} value={this.state.dias} placeholder="Ingrese los días de clases" ></textarea>
                                            </div>
                                            <div className="form-group col-sm-10">
                                                <label htmlFor="hora">Horario</label>
                                                <input type="text" onChange={this.handleChange} name="hora" id="hora" className="form-control form-control-sm" title="Ingrese un horario para la clase" required placeholder="Ingrese un horario de clase"/>
                                            </div>
                                            <div className="form-group col-sm-10">
                                                <label htmlFor="cantidad">Cantidad de participantes</label>
                                                <input type="number" onChange={this.handleChange} name="cantidad" id="cantidad" className="form-control form-control-sm validate" required title="Ingrese la cantidad de personas" autoComplete="off" value={this.state.cantidad} placeholder="Ingrese cantidad max personas"/>
                                            </div>
                                            <div className="form-group col-sm-10">
                                                <label htmlFor="actual">Cantidad actual</label>
                                                <input type="number" onChange={this.handleChange} name="actual" id="actual" className="form-control form-control-sm validate" required title="Ingrese la cantidad actual de personas en la clase" autoComplete="off" value={this.state.actual} placeholder="Ingrese actual de personas"/>
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
                                <div className="card-body">
                                    <h5 className="card-title">Listado de clases</h5>
                                    <table className="table table-hover table-dark">
                                        <thead>
                                            <tr>
                                                <th scope="col">Clase</th>
                                                <th scope="col">Horario</th>
                                                <th scope="col">Días</th>
                                                <th scope="col">Cantidad Pers.</th>
                                                <th scope="col">Actual</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                this.state.clases.map(clase => {
                                                    return (
                                                        <tr key={clase._id}>
                                                            <td>{clase.nombre}</td>
                                                            <td>{clase.horario}</td>
                                                            <td>{clase.dias}</td>
                                                            <td>{clase.cantidadPersona}</td>
                                                            <td>{clase.cantidadActual}</td>
                                                            <td>
                                                                <button className="btn btn-primary btn-sm">
                                                                    <i className="material-icons" onClick={() => this.editClase(clase._id)}>edit</i>
                                                                </button>
                                                                <button className="btn btn-danger btn-sm" style={{ margin: '4px' }}>
                                                                    <i className="material-icons" onClick={() => this.deleteClase(clase._id)}>delete</i>
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
