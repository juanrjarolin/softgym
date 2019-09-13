import React, { Component } from 'react'
import M from 'materialize-css/dist/js/materialize.min.js'
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
            isLoading: true,//what the hell is this
            _id: '', // and this 
            clientes: [],// maybe i know this
            editing: false // but this
        }
    }
    componentDidMount() {
        this.fetchClientes()
    } //???

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
            [e.target.name]: e.target.value// what ?
        })
    }

    async editCliente(id) {
        try {
            document.getElementById('form').reset();
            const cliente = await axios.get('http://localhost:4000/api/cliente/' + id)
            this.setState({
                tipoPersona: cliente.data.tipoPersona,
                name: cliente.data.name,
                direccion: cliente.data.direccion,
                cedula: cliente.data.cedula,
                telefono: cliente.data.telefono,
                _id: cliente.data._id,
                editing: false
            })
            M.updateTextFields();
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

    handleSubmint = async (e) => {
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
                M.updateTextFields();
                NotificationManager.success('Actualización realizada con éxito', 'Registro')
            } else {
                const res = await axios.post('http://localhost:4000/api/cliente', cliente)
                if (res.data.success === false) {
                    NotificationManager.error(res.data.message, 'Registro')
                } else{
                    this.setState({
                        tipoPersona: '',
                        name: '',
                        direccion: '',
                        cedula: '',
                        telefono: ''
                    })
                    this.fetchClientes()
                    document.getElementById('form').reset();
                    M.updateTextFields();
                    NotificationManager.success(res.data.message, 'Registro')
                }
            }
        }
    catch (error) {
            console.log('Error')

        }
    }
        render(){
            return (
                <div className="section container">
                    <div className="row">
                        <div className="col s4">
                            <div className="card">
                                <div className="card-content">
                                    <span className="card-title white-text">Registro de Clientes</span>
                                    <form onSubmit={this.handleSubmit} id="form">
                                        <div className="row">
                                            <div className="form-group col-sm-10">
                                                <label htmlFor="tipoPersona">Tipo Persona</label>

                                                <input type="text" minLength="2" maxLength="15" id="tipoPersona" onChange={this.handleChange} name="tipoPersona" className="form-control-sm" required pattern="[A-Za-z]+" title="Se requiere caracteres alfabéticos min: 3 y máx: 15" autoComplete="off" value={this.state.tipoPersona} />

                                                
                                            </div>
                                            <div className="form-group col-sm-10">
                                                <label htmlFor="name">Nombre</label>

                                                <input type="text" id="name" onChange={this.handleChange} name="name" className="form-control-sm" required pattern="[A-Za-z]+" title="Se requiere caracteres alfabéticos min: 3 y máx: 15" autoComplete="off" value={this.state.name} />

                                                
                                            </div>
                                            <div className="form-group col-sm-10">
                                                <label htmlFor="cedula">Cedula</label>

                                                <input type="text" id="cedula" onChange={this.handleChange} name="cedula" className="form-control-sm"  title="Se requiere caracteres alfabéticos min: 3 y máx: 15" autoComplete="off" value={this.state.cedula} />

                                               
                                            </div>
                                            <div className="form-group col-sm-10">
                                                <label htmlFor="direccion">Direccion</label>

                                                <input type="text" id="direccion" onChange={this.handleChange} name="direccion" className="validate white-text" required pattern="[A-Za-z]+" title="Se requiere caracteres alfabéticos min: 3 y máx: 15" autoComplete="off" value={this.state.direccion} />

                                               
                                            </div>
                                            <div className="form-group col-sm-10">
                                                <label htmlFor="telefono">Telefono</label>

                                                <input type="text" id="telefono" onChange={this.handleChange} name="telefono" className="form-control-sm"  title="Se requiere caracteres alfabéticos min: 3 y máx: 15" autoComplete="off" value={this.state.telefono} />

                                               
                                            </div>
                                        </div>
                                        <div className="form-group col-sm-10">
                                            <button type="submit" className="btn btn-primary btn-sm" name="action">Guardar</button>              
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                        <div className="col s8">
                            <div className="card">
                                <div className="card-body">
                                    <span className="card-title">Clientes</span>
                                    <table className="highlight">
                                        <thead>
                                            <tr className="white-text">
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
                                                        <tr key={cliente._id} className="white-text">
                                                            <td>{cliente.tipoPersona}</td>
                                                            <td>{cliente.name}</td>
                                                            <td>{cliente.cedula}</td>
                                                            <td>{cliente.direccion}</td>
                                                            <td>{cliente.telefono}</td>
                                                            <td>
                                                                <button className="btn btn-primary btn-sm">
                                                                    <i className="material-icons" onClick={() => this.editCliente(cliente._id)}>edit</i>
                                                                </button>
                                                                <button className="btn btn-danger btn-sm" style={{ margin: '4px' }}>
                                                                    <i className="material-icons" onClick={() => this.deleteCliente(cliente._id)}>delete</i>
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

