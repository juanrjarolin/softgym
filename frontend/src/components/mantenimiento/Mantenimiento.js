import React, { Component } from 'react'
import axios from 'axios'
import M from 'materialize-css/dist/js/materialize.min.js'
import { NotificationContainer, NotificationManager } from 'react-notifications'

export default class Mantenimiento extends Component {
    constructor() {
        super()
        this.state = {
            equipos: [],
            mantenimientos: [],
            equipo: '',
            detalles: '',
            editing: false,
            _id: ''
        }
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    componentDidMount() {
        this.concurrentFetch()
    }

    async concurrentFetch(){
        await Promise.all([this.fetchEquipos(), this.fetchMantenimientos()])
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

    async editMantenimiento(id){
        try {
            const result = await axios.get('http://localhost:4000/api/mantenimiento/' + id)
            this.setState({
                equipo: result.data.equipo._id,
                detalles: result.data.detalleMantenimiento,
                _id: result.data._id,
                editing: true
            })
            M.updateTextFields()
        } catch (error) {
            console.log(error)
        }
        
    }

    async deleteMantenimiento(id){
        try {
            const result = await axios.delete('http://localhost:4000/api/mantenimiento/' + id)
            if(result.data.success){
                this.fetchMantenimientos()
                NotificationManager.success(result.data.message, 'Registro')
            }
        } catch (error) {
            console.log(error)
        }
        
    }

    async completarMantenimiento(id){
        try {
            const result = await axios.put('http://localhost:4000/api/mantenimiento/completar/' + id)
            if(result.data.success){
                this.fetchMantenimientos()
                NotificationManager.success(result.data.message, 'Mantenimiento')
            }else{
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
                    M.updateTextFields()
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
                    M.updateTextFields()
                    NotificationManager.success(result.data.message, 'Registro')
                }
            }
        } catch (error) {
            NotificationManager.error('Ha ocurrido un error', 'Registro')
        }
    }

    render() {
        const { equipos } = this.state
        let opciones = equipos.map((equipo) =>
            <option key={equipo._id} value={equipo._id}>{equipo.nombre}</option>
        )
        return (
            <div className="section container">
                <div className="row">
                    <div className="col s4">
                        <div className="card">
                            <div className="card-content">
                                <span className="card-title white-text">Equipos</span>
                                <form onSubmit={this.handleSubmit} id="form">
                                    <div className="row">
                                        <div className="input-field col s12">
                                            <select className="browser-default" name="equipo" onChange={this.handleChange}>
                                                <option defaultValue>Seleccione un equipo</option>
                                                {
                                                    opciones
                                                }
                                            </select>
                                        </div>
                                        <div className="input-field col s12">
                                            <label htmlFor="detalles">Detalles</label>
                                            <textarea className="validate materialize-textarea" required name="detalles" id="detalles" onChange={this.handleChange} value={this.state.detalles} ></textarea>

                                            <span className="helper-text" data-error="Incorrecto" data-success="Correcto"></span>
                                        </div>
                                        <div className="input-field col s12">
                                            <button type="submit" className="btn waves-effect waves-light btn-small center-align" name="action">Guardar
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div className="col s8">
                        <div className="card">
                            <div className="card-content">
                                <span className="card-title white-text">Mantenimientos en curso</span>
                                <table>
                                    <thead>
                                        <tr className="white-text">
                                            <th>Equipo</th>
                                            <th>Detalles</th>
                                            <th>Estado</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            this.state.mantenimientos.map((mant) => {
                                                return (
                                                    <tr key={mant._id} className="white-text">
                                                        <td>{mant.equipo.nombre}</td>
                                                        <td>{mant.detalleMantenimiento}</td>
                                                        <td>{mant.estado}</td>
                                                        <td>
                                                            <button className="btn waves-effect waves-light btn-small">
                                                                <i className="material-icons" onClick={() => this.editMantenimiento(mant._id)}>edit</i>
                                                            </button>
                                                            <button className="btn waves-effect waves-light btn-small" style={{ margin: '4px' }}>
                                                                <i className="material-icons" onClick={() => this.deleteMantenimiento(mant._id)}>delete</i>
                                                            </button>
                                                            <button title="Completar mantenimiento" className="btn waves-effect waves-light btn-small" style={{ margin: '4px' }}>
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
    }
}