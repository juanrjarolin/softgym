import React, { Component } from 'react'
import axios from 'axios';
import { NotificationContainer, NotificationManager } from 'react-notifications'
import jwt_decode from 'jwt-decode'
import Security from '../security/Security'

export default class Signup extends Component {
    constructor() {
        super()
        this.state = {
            firstName: '',
            lastName: '',
            email: '',
            rols: [],
            role: '',
            users: [],
            editing: false,
            _id: '',
            isLoading: false,
            showRegistro: false,
            showVisualizacion: false,
            showEdit: false,
            showDelete: false,
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    //funcion que se ejecuta al cargarse el componente
    componentDidMount() {
        var token = localStorage.getItem('usertoken')
        if (token) {
            //decodifica el token
            const decode = jwt_decode(token)

            if (decode.permisos.crearUsuario) {
                this.setState({
                    showRegistro: true,
                    isLoading: true
                })
                //estable un headers por defecto con el token obtenido
                axios.defaults.headers.common['Authorization'] = token

                //se actualizan las listas del state
                this.fetchRols()
            }

            if (decode.permisos.visualizarUsuario) {
                this.setState({
                    showVisualizacion: true,
                    isLoading: true
                })
                this.fetchUsers()
            }

            if (decode.permisos.editarUsuario) {
                this.setState({
                    showEdit: true,
                    isLoading: true
                })
            }

            if (decode.permisos.eliminarUsuario) {
                this.setState({
                    showDelete: true,
                    isLoading: true
                })
            }

        } else {
            this.setState({
                isLoading: false
            })
        }
    }

    async fetchRols() {
        try {
            await axios.get('http://localhost:4000/api/rols')
                .then(res => {
                    if (res.data.success === false) {
                        this.setState({
                            isLoading: false
                        })
                    } else {
                        this.setState({
                            rols: res.data,
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

    async fetchUsers() {
        try {
            await axios.get('http://localhost:4000/api/account')
                .then(res => {
                    if (res.data.success === false) {
                        this.setState({
                            isLoading: false
                        })
                    } else {
                        this.setState({
                            users: res.data
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

    async editUser(id) {
        const res = await axios.get('http://localhost:4000/api/account/' + id)
        this.setState({
            firstName: res.data.firstName,
            lastName: res.data.lastName,
            email: res.data.email,
            role: res.data.role._id,
            _id: res.data._id,
            editing: true
        })
    }

    async deleteUser(id) {
        await axios.delete('http://localhost:4000/api/account/' + id)
            .then(res => {
                if (res.data.success) {
                    this.fetchUsers()
                    NotificationManager.success(res.data.message, 'Registro')
                }
            })
            .catch(err => {
                NotificationManager.error('Vaya! Ha ocurrido un error')
            })

    }

    handleSubmit = async (e) => {
        e.preventDefault()
        const user = {
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            email: this.state.email,
            role: this.state.role
        }

        if (this.state.editing) {
            await axios.put('http://localhost:4000/api/account/' + this.state._id, user)
            this.fetchUsers();
            this.setState({
                firstName: '',
                lastName: '',
                email: '',
                role: ''
            })
            document.getElementById('form').reset();
            NotificationManager.success('Actualización realizada con éxito', 'Registro')
        } else {
            await axios.post('http://localhost:4000/api/account/signup', user)
                .then(res => {
                    if (res.data.success === false) {
                        //Este mensaje se mostrará solo si se logra truncar la validacion del frontend
                        //el backend tambien se encuentra validado
                        NotificationManager.error(res.data.message, 'Registro')
                    } else {
                        //this.props.history.push(`/signin`)
                        this.setState({
                            firstName: '',
                            lastName: '',
                            email: '',
                            role: ''
                        })
                        this.fetchUsers();
                        document.getElementById('form').reset();
                        NotificationManager.success('Registro realizado con éxito', 'Registro')
                        NotificationManager.info(res.data.emailMessage, 'Registro')
                    }
                })
                .catch(err => {
                    NotificationManager.error('Vaya! Ha ocurrido un error', 'Error')
                })
        }
    }

    render() {
        const { isLoading, showRegistro, showVisualizacion, showEdit, showDelete } = this.state

        const registro = (
            <div className="col-sm-4">
                <div className="card">
                    <div className="card-body">
                        <h5 className="card-title">Registro de usuario</h5>
                        <form onSubmit={this.handleSubmit} id="form">
                            <div className="row">
                                <div className="form-group col-sm-10">
                                    <label htmlFor="firstName">Nombre</label>

                                    <input type="text" minLength="3" maxLength="15" id="firstName" onChange={this.handleChange} name="firstName" className="form-control form-control-sm" required pattern="[A-Za-z]+" title="Se requiere caracteres alfabéticos min: 3 y máx: 15" autoComplete="off" value={this.state.firstName} placeholder="Ingrese el nombre del usuario" />

                                </div>

                                <div className="form-group col-sm-10">
                                    <label htmlFor="lastName">Apellido</label>

                                    <input type="text" minLength="3" maxLength="15" id="lastName" onChange={this.handleChange} name="lastName" className="form-control form-control-sm" required pattern="[A-Za-z]+" title="Se requiere caracteres alfabéticos min: 3 máx: 15" autoComplete="off" value={this.state.lastName} placeholder="Ingrese el apellido del usuario" />

                                </div>

                                <div className="form-group col-sm-10">
                                    <label htmlFor="email">Correo electrónico</label>
                                    <input type="email" id="email" onChange={this.handleChange} name="email" className="form-control form-control-sm" required title="Se puede ingresar caracteres alfabéticos o alfanuméricos min:5 y máx:15" autoComplete="off" value={this.state.email} placeholder="Ingrese el email del usuario" />
                                </div>

                                <div className="form-group col-sm-6">
                                    <label htmlFor="rol">Rol del usuario</label>
                                    <select className="form-control form-control-sm" name="role" id="rol" onChange={this.handleChange} >
                                        <option defaultValue>Seleccione un rol</option>
                                        {
                                            this.state.rols.map(rol => {
                                                return (
                                                    <option key={rol._id} value={rol._id}>{rol.name}</option>
                                                )
                                            })
                                        }
                                    </select>
                                </div>
                                <div className="form-group col-sm-11">
                                    <button type="submit" className="btn btn-primary btn-sm" name="action">Guardar</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )

        const visualizar = (
            <div className="col-sm-8">
                <div className="card">
                    <div className="card-header">Listado de usuarios</div>
                    <div className="card-body">
                        <table className="table table-hover table-dark">
                            <thead>
                                <tr className="px-2">
                                    <th scope="col">Nombre</th>
                                    <th scope="col">Apellido</th>
                                    <th scope="col">Correo</th>
                                    <th scope="col">Rol</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    this.state.users.map(user => {
                                        return (
                                            <tr key={user._id}>
                                                <td>{user.firstName}</td>
                                                <td>{user.lastName}</td>
                                                <td>{user.email}</td>
                                                <td>{user.role.name}</td>
                                                <td>
                                                    {showEdit && <button className="btn btn-primary btn-sm">
                                                        <i className="material-icons" onClick={() => this.editUser(user._id)}>edit</i>
                                                    </button>}
                                                    {showDelete && <button className="btn btn-danger btn-sm" style={{ margin: '4px' }}>
                                                        <i className="material-icons" onClick={() => this.deleteUser(user._id)}>delete</i>
                                                    </button>}
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
        )

        if (isLoading) {
            return (
                <div className="container py-5 animated zoomIn">
                    <div className="row">
                        {showRegistro && registro}
                        {showVisualizacion && visualizar}
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
