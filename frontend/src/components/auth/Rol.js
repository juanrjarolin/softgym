import React, { Component } from 'react'
import M from 'materialize-css'
import axios from 'axios';
import { NotificationContainer, NotificationManager } from 'react-notifications'
import jwt_decode from 'jwt-decode'
import Security from '../security/Security';

var style = {
    backgroundColor: 'rgba(0, 0, 0, .6)'
}

export default class Rol extends Component {

    constructor() {
        super()
        this.state = {
            name: '',
            rols: [],
            _id: '',
            editing: false,
            isLoading: true
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    componentDidMount() {
        try {
            var token = localStorage.getItem('usertoken')
            if (token) {
                //decodifica el token
                const decode = jwt_decode(token)
                if (decode.role === 'administrador') {
                    //estable un headers por defecto con el token obtenido
                    axios.defaults.headers.common['Authorization'] = token
                    //se actualizan la lista del state
                    this.fetchRols()

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
        } catch (error) {
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

    async editRol(id) {
        document.getElementById('form').reset();
        const res = await axios.get('http://localhost:4000/api/rols/' + id)
        this.setState({
            name: res.data.name,
            _id: res.data._id,
            editing: true
        })
        M.updateTextFields();
    }

    async deleteRol(id) {
        await axios.delete('http://localhost:4000/api/rols/' + id)
            .then(res => {
                if (res.data.success) {
                    this.fetchRols()
                    NotificationManager.success(res.data.message, 'Registro')
                }
            })
            .catch(err => {
                console.log('Error' + err)
            })
    }

    handleSubmit = async (e) => {
        e.preventDefault()
        const rol = {
            name: this.state.name
        }

        if (this.state.editing) {
            await axios.put('http://localhost:4000/api/rols/' + this.state._id, rol)
            this.fetchRols();
            this.setState({
                name: '',
                editing: false,
                _id: ''
            })
            document.getElementById('form').reset();
            M.updateTextFields();
            NotificationManager.success('Actualización realizada con éxito', 'Registro')
        } else {
            await axios.post('http://localhost:4000/api/rols', rol)
                .then(res => {
                    if (res.data.success === false) {
                        //Este mensaje se mostrará solo si se logra truncar la validacion del frontend
                        //el backend tambien se encuentra validado
                        NotificationManager.error(res.data.message, 'Registro')
                    } else {
                        this.setState({
                            name: ''
                        })
                        this.fetchRols();
                        document.getElementById('form').reset();
                        NotificationManager.success('Registro realizado con éxito', 'Registro')
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        }
    }

    render() {
        const { isLoading } = this.state
        if (isLoading) {
            return (
                <div className="section container">
                    <div className="row">
                        <div className="col s4">
                            <div className="card" style={style}>
                                <div className="card-content">
                                    <span className="card-title white-text">Registro de roles</span>
                                    <form onSubmit={this.handleSubmit} id="form">
                                        <div className="row">
                                            <div className="input-field col s12" style={{ height: '50px' }}>
                                                <label htmlFor="name">Nombre del rol</label>

                                                <input type="text" minLength="3" maxLength="15" id="name" onChange={this.handleChange} name="name" className="validate white-text" required pattern="[A-Za-z]+" title="Ingresar en minúsculas: administrador/usuario" autoComplete="off" value={this.state.name} />

                                                <span className="helper-text" data-error="Incorrecto" data-success="Correcto"></span>
                                            </div>
                                        </div>
                                        <button type="submit" className="btn waves-effect waves-light btn-small center-align" name="action">Guardar<i className="small material-icons right">save</i>
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                        <div className="col s8">
                            <div className="card" style={style}>
                                <div className="card-content">
                                    <span className="card-title white-text">Dashboard</span>
                                    <table className="highlight">
                                        <thead>
                                            <tr className="white-text">
                                                <th>Nombre</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                this.state.rols.map(rol => {
                                                    return (
                                                        <tr key={rol._id} className="white-text">
                                                            <td>{rol.name}</td>
                                                            <td>
                                                                <button className="btn waves-effect waves-light btn-small">
                                                                    <i className="material-icons" onClick={() => this.editRol(rol._id)}>edit</i>
                                                                </button>
                                                                <button className="btn waves-effect waves-light btn-small" style={{ margin: '4px' }}>
                                                                    <i className="material-icons" onClick={() => this.deleteRol(rol._id)}>delete</i>
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
