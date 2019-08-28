import React, { Component } from 'react'
import axios from 'axios'
import M from 'materialize-css/dist/js/materialize.min.js'
import { NotificationContainer, NotificationManager } from 'react-notifications'

export default class Proveedor extends Component {

    constructor() {
        super()
        this.state = {
            nombre: '',
            apellido: '',
            direccion: '',
            telefono: '',
            cedula: '',
            correo: '',
            _id: '',
            proveedores: [],
            editing: false,
            isLoading: true
        }
    }

    componentDidMount() {
        this.fetchProveedores()
    }

    async fetchProveedores() {
        try {
            await axios.get('http://localhost:4000/api/proveedores')
                .then(res => {
                    if (res.data.success === false) {
                        this.setState({
                            isLoading: false
                        })
                    } else {
                        this.setState({
                            proveedores: res.data,
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
        const proveedor = {
            nombre: this.state.nombre,
            apellido: this.state.apellido,
            cedula: this.state.cedula,
            direccion: this.state.direccion,
            telefono: this.state.telefono,
            correo: this.state.correo
        }

        if (this.state.editing) {
            await axios.put('http://localhost:4000/api/proveedores/' + this.state._id, proveedor)
            this.fetchProveedores();
            this.setState({
                nombre: '',
                apellido: '',
                cedula: '',
                direccion: '',
                telefono: '',
                correo: '',
                _id: '',
                editing: false
            })
            document.getElementById('form').reset();
            M.updateTextFields();
            NotificationManager.success('Actualización realizada con éxito', 'Registro')
        } else {
            await axios.post('http://localhost:4000/api/proveedores', proveedor)
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
                        })
                        this.fetchProveedores();
                        document.getElementById('form').reset();
                        M.updateTextFields();
                        NotificationManager.success('Registro realizado con éxito', 'Registro')
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        }
    }

    async editProveedor(id) {
        const res = await axios.get('http://localhost:4000/api/proveedores/' + id)
        this.setState({
            nombre: res.data.nombre,
            apellido: res.data.apellido,
            cedula: res.data.cedula,
            direccion: res.data.direccion,
            telefono: res.data.telefono,
            correo: res.data.correo,
            _id: res.data._id,
            editing: true
        })
        M.updateTextFields();
    }

    async deleteProveedor(id){
        await axios.delete('http://localhost:4000/api/proveedores/' + id)
            .then(res => {
                if (res.data.success) {
                    this.fetchProveedores()
                    NotificationManager.success(res.data.message, 'Registro')
                }
            })
            .catch(err => {
                console.log('Error' + err)
            })
    }

    render() {
        return (
            <div className="section container">
                <div className="row">
                    <div className="col s4">
                        <div className="card">
                            <div className="card-content">
                                <span className="card-title white-text">Registro de proveedores</span>
                                <form onSubmit={this.handleSubmit} id="form">
                                    <div className="row">
                                        <div className="input-field col s6">
                                            <label htmlFor="nombre">Nombre</label>
                                            <input type="text" minLength="3" maxLength="15" onChange={this.handleChange} name="nombre" id="nombre" className="validate white-text" required pattern="[A-Za-z]+" title="Ingrese nombre del proveedor" autoComplete="off" value={this.state.nombre} />

                                            <span className="helper-text" data-error="Incorrecto" data-success="Correcto"></span>
                                        </div>
                                        <div className="input-field col s6">
                                            <label htmlFor="apellido">Apellido</label>
                                            <input type="text" minLength="3" maxLength="15" onChange={this.handleChange} name="apellido" id="apellido" className="validate white-text" required pattern="[A-Za-z]+" title="Ingrese apellido del proveedor" autoComplete="off" value={this.state.apellido} />

                                            <span className="helper-text" data-error="Incorrecto" data-success="Correcto"></span>
                                        </div>
                                        <div className="input-field col 12">
                                            <label htmlFor="direccion">Dirección</label>
                                            <input type="text" minLength="3" maxLength="15" onChange={this.handleChange} name="direccion" id="direccion" className="validate white-text" required pattern="[A-Za-z]+" title="Ingrese dirección del proveedor" autoComplete="off" value={this.state.direccion} />

                                            <span className="helper-text" data-error="Incorrecto" data-success="Correcto"></span>
                                        </div>
                                        <div className="input-field col 12">
                                            <label htmlFor="cedula">Cédula</label>
                                            <input type="number" minLength="3" maxLength="15" onChange={this.handleChange} name="cedula" id="cedula" className="validate white-text" required pattern="[A-Za-z]+" title="Ingrese cedula del proveedor" autoComplete="off" value={this.state.cedula} />

                                            <span className="helper-text" data-error="Incorrecto" data-success="Correcto"></span>
                                        </div>
                                        <div className="input-field col 12">
                                            <label htmlFor="telefono">Teléfono</label>
                                            <input type="number" minLength="3" maxLength="15" onChange={this.handleChange} name="telefono" id="telefono" className="validate white-text" required pattern="[A-Za-z]+" title="Ingrese telefono del proveedor" autoComplete="off" value={this.state.telefono} />

                                            <span className="helper-text" data-error="Incorrecto" data-success="Correcto"></span>
                                        </div>
                                        <div className="input-field col 12">
                                            <label htmlFor="correo">Correo</label>
                                            <input type="email" onChange={this.handleChange} name="correo" id="correo" className="validate white-text" required title="Ingrese correo del proveedor" autoComplete="off" value={this.state.correo} />

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
                                <span className="card-title white-text">Listado de proveedores</span>
                                <table className="highlight">
                                    <thead>
                                        <tr className="white-text">
                                            <th>Nombre</th>
                                            <th>Apellido</th>
                                            <th>Cédula</th>
                                            <th>Dirección</th>
                                            <th>Teléf.</th>
                                            <th>Correo</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            this.state.proveedores.map(proveedor => {
                                                return (
                                                    <tr key={proveedor._id} className="white-text">
                                                        <td>{proveedor.nombre}</td>
                                                        <td>{proveedor.apellido}</td>
                                                        <td>{proveedor.cedula}</td>
                                                        <td>{proveedor.direccion}</td>
                                                        <td>{proveedor.telefono}</td>
                                                        <td>{proveedor.correo}</td>
                                                        <td>
                                                            <button className="btn waves-effect waves-light btn-small">
                                                                <i className="material-icons" onClick={() => this.editProveedor(proveedor._id)}>edit</i>
                                                            </button>
                                                            <button className="btn waves-effect waves-light btn-small" style={{ margin: '4px' }}>
                                                                <i className="material-icons" onClick={() => this.deleteProveedor(proveedor._id)}>delete</i>
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
