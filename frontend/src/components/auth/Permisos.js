import React, { Component } from 'react'
import axios from 'axios'
import { NotificationContainer, NotificationManager } from 'react-notifications'
import Customizado from './Customizado'
import Security from '../security/Security'
import jwt_decode from 'jwt-decode'

export default class Permisos extends Component {
    constructor() {
        super()
        this.state = {
            rol: '',
            roles: [],
            cargaCustomizado: false,
            permisosRol: {},
            isLoading: false
        }
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleSubmit = async(e) => {
        e.preventDefault()
        this.setState({
            cargaCustomizado: false
        })

        if(!this.state.rol){
            this.setState({
                cargaCustomizado: false
            })
            NotificationManager.error('Seleccione un rol', 'Error')
        }else{
            try {
                const res = await axios.get('http://localhost:4000/api/permisos/' + this.state.rol)
                this.setState({
                    permisosRol: res.data,
                    cargaCustomizado: true
                })
            } catch (error) {
                NotificationManager.error('Ocurrió un error con la conexión al servidor', 'Error')
            }
        }
    }

    componentDidMount() {
        try {
            var token = localStorage.getItem('usertoken')
            if (token) {
                //decodifica el token
                const decode = jwt_decode(token)
                if (decode.permisos.visualizarPermiso) {
                    this.setState({
                        isLoading: true
                    })
                    //estable un headers por defecto con el token obtenido
                    axios.defaults.headers.common['Authorization'] = token
                    //se actualizan la lista del state
                    this.fetchRoles()
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

    async fetchRoles() {
        try {
            const res = await axios.get('http://localhost:4000/api/rols')
            this.setState({
                roles: res.data
            })
        } catch (error) {
            NotificationManager.error('Ocurrió un error en la conexión', 'Conexión')
        }
    }

    handleCust = async(e, list) => {
        e.preventDefault()
        const permisos = {
            rol: this.state.rol,
            permisos: list[0] //en la posicion 0 estan los permisos
        }

        if(list[1]){
            try {
                const res = await axios.put('http://localhost:4000/api/permisos/' + this.state.rol,  permisos)
                if(res.data.success){
                    NotificationManager.success(res.data.message, 'Gestión de permisos')
                }else{
                    NotificationManager.error(res.data.message, 'Gestión de permisos')
                }
            } catch (error) {
                NotificationManager.error('Ocurrió un error en la conexión', 'Error')
            }
        }else{
            try {
                const res = await axios.post('http://localhost:4000/api/permisos', permisos)
                if(res.data.success){
                    NotificationManager.success(res.data.message, 'Gestión de permisos')
                }else{
                    NotificationManager.error(res.data.message, 'Gestión de permisos')
                }
            } catch (error) {
                NotificationManager.error('Ocurrió un error en la conexión', 'Error')
            }
        }
    }

    render() {
        const {cargaCustomizado, isLoading} = this.state
        if(isLoading){
            return (
                <div className="container py-5">
                    <div className="row">
                        <div className="col-sm-4">
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title">Roles</h5>
                                    <form id="form" onSubmit={this.handleSubmit}>
                                        <div className="row">
                                            <div className="form-group col-sm-10">
                                                <select name="rol" id="rol" className="form-control form-control-sm" onChange={this.handleChange}>
                                                    <option defaultValue>Elija una opcion</option>
                                                    {
                                                        this.state.roles.map((rol) => {
                                                            return (
                                                                <option key={rol._id} value={rol._id}>{rol.name}</option>
                                                            )
                                                        })
                                                    }
                                                </select>
                                            </div>
                                            <div className="form-group col-sm-12">
                                                <button type="submit" className="btn btn-primary btn-sm">Siguiente</button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-8">
                            {cargaCustomizado && <Customizado handleSubmitCust={this.handleCust} permisos = {this.state.permisosRol}/>}
                        </div>
                        <NotificationContainer />
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
