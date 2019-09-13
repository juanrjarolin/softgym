import React, { Component } from 'react'
import axios from 'axios'
import { NotificationContainer, NotificationManager } from 'react-notifications'
import jwt_decode from 'jwt-decode'
import Security from '../security/Security'

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
        var token = localStorage.getItem('usertoken')
        if (token) {
            //decodifica el token
            const decode = jwt_decode(token)
            if (decode.role === 'administrador') {
                //estable un headers por defecto con el token obtenido
                axios.defaults.headers.common['Authorization'] = token

                //se actualizan las listas del state
                this.fetchProveedores()
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
        const {isLoading} = this.state
        if(isLoading){
            return (
                <div className="container py-5">
                    <NotificationContainer />
                    <div className="row">
                        <div className="col-sm-4">
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title">Registro de proveedores</h5>
                                    <form onSubmit={this.handleSubmit} id="form">
                                        <div className="row">
                                            <div className="form-group col-sm-10">
                                                <label htmlFor="nombre">Nombre</label>
    
                                                <input type="text" minLength="3" maxLength="15" onChange={this.handleChange} name="nombre" id="nombre" className="form-control form-control-sm validate" required pattern="[A-Za-z]+" title="Ingrese nombre del proveedor" autoComplete="off" value={this.state.nombre} placeholder="Ingrese el nombre del proveedor"/>
    
                                            </div>
                                            <div className="form-group col-sm-10">
                                                <label htmlFor="apellido">Apellido</label>
    
                                                <input type="text" minLength="3" maxLength="15" onChange={this.handleChange} name="apellido" id="apellido" className="form-control form-control-sm validate" required pattern="[A-Za-z]+" title="Ingrese apellido del proveedor" autoComplete="off" value={this.state.apellido} placeholder="Ingrese apellido del proveedor"/>
    
                                            </div>
                                            <div className="form-group col-sm-10">
                                                <label htmlFor="direccion">Dirección</label>
    
                                                <input type="text" minLength="3" maxLength="15" onChange={this.handleChange} name="direccion" id="direccion" className="form-control form-control-sm validate" required pattern="[A-Za-z]+" title="Ingrese dirección del proveedor" autoComplete="off" value={this.state.direccion} placeholder="Ingrese dirección del proveedor"/>
    
                                            </div>
                                            <div className="form-group col-sm-10">
                                                <label htmlFor="cedula">Cédula</label>
    
                                                <input type="number" minLength="3" maxLength="15" onChange={this.handleChange} name="cedula" id="cedula" className="form-control form-control-sm validate" required pattern="[A-Za-z]+" title="Ingrese cedula del proveedor" autoComplete="off" value={this.state.cedula} placeholder="Ingrese cédula del proveedor"/>
    
                                            </div>
                                            <div className="form-group col-sm-10">
                                                <label htmlFor="telefono">Teléfono</label>
                                                <input type="number" minLength="3" maxLength="15" onChange={this.handleChange} name="telefono" id="telefono" className="form-control form-control-sm validate" required pattern="[A-Za-z]+" title="Ingrese telefono del proveedor" autoComplete="off" value={this.state.telefono} placeholder="Ingrese teléfono del proveedor"/>
    
                                            </div>
                                            <div className="form-group col-sm-10">
                                                <label htmlFor="correo">Correo</label>
    
                                                <input type="email" onChange={this.handleChange} name="correo" id="correo" className="form-control form-control-sm validate" required title="Ingrese correo del proveedor" autoComplete="off" value={this.state.correo} placeholder="Ingrese email del proveedor"/>
    
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
                        <div className="col-md-8">
                            <div className="card">
                                <div className="card-header">Listado de proveedores</div>
                                <div className="card-body">
                                    <table className="table table-hover table-dark">
                                        <thead>
                                            <tr>
                                                <th scope="col">Nombre</th>
                                                <th scope="col">Cédula</th>
                                                <th scope="col">Dirección</th>
                                                <th scope="col">Teléf.</th>
                                                <th scope="col">Correo</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                this.state.proveedores.map(proveedor => {
                                                    return (
                                                        <tr key={proveedor._id}>
                                                            <td>{proveedor.nombre + " " + proveedor.apellido}</td>
                                                            <td>{proveedor.cedula}</td>
                                                            <td>{proveedor.direccion}</td>
                                                            <td>{proveedor.telefono}</td>
                                                            <td>{proveedor.correo}</td>
                                                            <td>
                                                                <button className="btn btn-primary btn-sm">
                                                                    <i className="material-icons" onClick={() => this.editProveedor(proveedor._id)}>edit</i>
                                                                </button>
                                                                <button className="btn btn-danger btn-sm" style={{ margin: '4px' }}>
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
                </div>
            )
        }else{
            return (
                <Security />
            )
        }
    }
}
