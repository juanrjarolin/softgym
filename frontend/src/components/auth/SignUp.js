import React, { Component } from 'react'
import M from 'materialize-css/dist/js/materialize.min.js'
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
            isLoading: true
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
            if (decode.role === 'administrador') {
                //estable un headers por defecto con el token obtenido
                axios.defaults.headers.common['Authorization'] = token
                
                //se actualizan las listas del state
                this.fetchRols()
                this.fetchUsers()

                //se renderiza
                this.setState({
                    isLoading: true
                })
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
        M.updateTextFields();
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
        const { isLoading } = this.state
        if (isLoading) {
            var elems = document.querySelectorAll('select')
            M.FormSelect.init(elems)
            return (
                <div className="section container animated zoomIn">
                    <div className="row">
                        <div className="col s4">
                            <div className="card">
                                <div className="card-content">
                                    <span className="card-title white-text">Registro de usuario</span>
                                    <form onSubmit={this.handleSubmit} id="form">
                                        <div className="row">
                                            <div className="input-field col s6">
                                                <label htmlFor="firstName">Nombre</label>

                                                <input type="text" minLength="3" maxLength="15" id="firstName" onChange={this.handleChange} name="firstName" className="validate white-text" required pattern="[A-Za-z]+" title="Se requiere caracteres alfabéticos min: 3 y máx: 15" autoComplete="off" value={this.state.firstName} />

                                                <span className="helper-text" data-error="Incorrecto" data-success="Correcto"></span>
                                            </div>

                                            <div className="input-field col s6">
                                                <label htmlFor="lastName">Apellido</label>
                                                <input type="text" minLength="3" maxLength="15" id="lastName" onChange={this.handleChange} name="lastName" className="validate white-text" required pattern="[A-Za-z]+" title="Se requiere caracteres alfabéticos min: 3 máx: 15" autoComplete="off" value={this.state.lastName} />
                                                <span className="helper-text" data-error="Incorrecto" data-success="Correcto"></span>
                                            </div>

                                            <div className="input-field col s12">
                                                <label htmlFor="email">Correo electrónico</label>
                                                <input type="email" id="email" onChange={this.handleChange} name="email" className="validate white-text" required title="Se puede ingresar caracteres alfabéticos o alfanuméricos min:5 y máx:15" autoComplete="off" value={this.state.email} />
                                                <span className="helper-text" data-error="Incorrecto" data-success="Correcto"></span>
                                            </div>

                                            <div className="input-field col s12">
                                                <select className="white-text" name="role" onChange={this.handleChange} >
                                                    <option defaultValue>Seleccione un rol</option>
                                                    {
                                                        this.state.rols.map(rol => {
                                                            return (
                                                                <option key={rol._id} value={rol._id}>{rol.name}</option>
                                                            )
                                                        })
                                                    }
                                                </select>
                                                <label>Elija un rol para el usuario</label>
                                            </div>
                                        </div>
                                        <button type="submit" className="btn waves-effect waves-light btn-small center-align" name="action">Guardar<i className="small material-icons right">save</i>
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                        <div className="col s8">
                            <div className="card">
                                <div className="card-content">
                                    <span className="card-title white-text">Dashboard</span>
                                    <table className="highlight">
                                        <thead>
                                            <tr className="white-text">
                                                <th>Nombre</th>
                                                <th>Apellido</th>
                                                <th>Correo</th>
                                                <th>Rol</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                this.state.users.map(user => {
                                                    return (
                                                        <tr key={user._id} className="white-text">
                                                            <td>{user.firstName}</td>
                                                            <td>{user.lastName}</td>
                                                            <td>{user.email}</td>
                                                            <td>{user.role.name}</td>
                                                            <td>
                                                                <button className="btn waves-effect waves-light btn-small">
                                                                    <i className="material-icons" onClick={() => this.editUser(user._id)}>edit</i>
                                                                </button>
                                                                <button className="btn waves-effect waves-light btn-small" style={{ margin: '4px' }}>
                                                                    <i className="material-icons" onClick={() => this.deleteUser(user._id)}>delete</i>
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
        } else {
            return (
                <Security />
            )
        }
    }

}
