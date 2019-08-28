import React, { Component } from 'react'
import axios from 'axios'
import M from 'materialize-css/dist/js/materialize.min.js'
import { NotificationContainer, NotificationManager } from 'react-notifications'

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
            isLoading: true
        }
    }

    componentDidMount() {
        this.fetchEquipos()
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
                if(result.data.success){
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
                    M.updateTextFields()
                }
            } else {
                const result = await axios.post('http://localhost:4000/api/equipos', equipo)
                if (result.data.success === false) {
                    NotificationManager.error(result.data.message, 'Registro')
                } else {
                    this.setState({
                        nombre: '',
                        cod_equipo: '',
                        costo: '',
                        descripcion: ''
                    })
                    this.fetchEquipos()
                    document.getElementById('form').reset()
                    M.updateTextFields()
                    NotificationManager.success(result.data.message, 'Registro')
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
            M.updateTextFields()
        } catch (error) {
            NotificationManager.error('Ha ocurrido un error', 'Registro')
        }
    }

    async deleteEquipo(id) {
        try {
            const result = await axios.delete('http://localhost:4000/api/equipos/' + id)
            if(result.data.success){
                this.fetchEquipos()
                NotificationManager.success(result.data.message, 'Registro')
            }
        } catch (error) {
            NotificationManager.error('Ha ocurrido un error', 'Registro')
        }
    }

    render() {
        return (
            <div className="section container">
                <div className="row">
                    <div className="col s4">
                        <div className="card">
                            <div className="card-content">
                                <span className="card-title white-text">Registro de equipos</span>
                                <form onSubmit={this.handleSubmit} id="form">
                                    <div className="row">
                                        <div className="input-field col s12">
                                            <label htmlFor="nombre">Nombre</label>
                                            <input type="text" minLength="3" maxLength="15" onChange={this.handleChange} name="nombre" id="nombre" className="validate white-text" required pattern="[A-Za-z]+" title="Ingrese nombre del equipo" autoComplete="off" value={this.state.nombre} />

                                            <span className="helper-text" data-error="Incorrecto" data-success="Correcto"></span>
                                        </div>
                                        <div className="input-field col s12">
                                            <label htmlFor="cod_equipo">Código del equipo</label>
                                            <input type="text" minLength="3" maxLength="15" onChange={this.handleChange} name="cod_equipo" id="cod_equipo" className="validate white-text" required pattern="[A-Za-z]+" title="Ingrese el codigo del equipo" autoComplete="off" value={this.state.cod_equipo} />

                                            <span className="helper-text" data-error="Incorrecto" data-success="Correcto"></span>
                                        </div>
                                        <div className="input-field col s12">
                                            <label htmlFor="costo">Costo</label>
                                            <input type="number" onChange={this.handleChange} name="costo" id="costo" className="validate white-text" required pattern="[A-Za-z]+" title="Ingrese costo del equipo" autoComplete="off" value={this.state.costo} />

                                            <span className="helper-text" data-error="Incorrecto" data-success="Correcto"></span>
                                        </div>
                                        <div className="input-field col s12">
                                            <label htmlFor="descripcion">Descripción</label>
                                            <textarea className="validate materialize-textarea" required name="descripcion" id="descripcion" onChange={this.handleChange} value={this.state.descripcion} ></textarea>

                                            <span className="helper-text" data-error="Incorrecto" data-success="Correcto"></span>
                                        </div>
                                    </div>
                                    <button type="submit" className="btn waves-effect waves-light btn-small center-align" name="action">Guardar
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div className="col s8">
                        <div className="card">
                            <div className="card-content">
                                <span className="card-title white-text">Equipos</span>
                                <table>
                                    <thead>
                                        <tr className="white-text">
                                            <th>Nombre</th>
                                            <th>Código</th>
                                            <th>Costo(Gs.)</th>
                                            <th>Descripción</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            this.state.equipos.map(equipo => {
                                                return (
                                                    <tr key={equipo._id} className="white-text">
                                                        <td>{equipo.nombre}</td>
                                                        <td>{equipo.cod_equipo}</td>
                                                        <td>{equipo.costo}</td>
                                                        <td>{equipo.descripcion}</td>
                                                        <td>
                                                            <button className="btn waves-effect waves-light btn-small">
                                                                <i className="material-icons" onClick={() => this.editEquipo(equipo._id)}>edit</i>
                                                            </button>
                                                            <button className="btn waves-effect waves-light btn-small" style={{ margin: '4px' }}>
                                                                <i className="material-icons" onClick={() => this.deleteEquipo(equipo._id)}>delete</i>
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
    }
}
