import React, { Component } from 'react'
import jwt_decode from 'jwt-decode'
import axios from 'axios';
import Moment from 'moment';
import 'moment/locale/es';

var style = {
    backgroundColor: 'rgba(0, 0, 0, .6)'
}

export default class ActionUsers extends Component {

    constructor(){
        super()
        this.state = {
            isLoading: true,
            sessions: []
        }
    }

    componentDidMount(){
        var token = localStorage.getItem('usertoken')
        if(token){
            const decode = jwt_decode(token)
            if(decode.role === 'administrador'){
                axios.defaults.headers.common['Authorization'] = token
                //se actualizan las sesiones
                this.fetchSessions()
            }
        } else {
            this.setState({
                isLoading: false
            })
        }
    }

    async fetchSessions(){
        try {
            const sessions = await axios.get('http://localhost:4000/api/sessions')
            this.setState({
                sessions: sessions.data
            })
        } catch (error) {
            console.log(error)
        }
    }

    render() {
        return (
            <div className="section container">
                <div className="row">
                    <div className="col s12">
                        <div className="card" style={style}>
                            <div className="card-content">
                                <span className="card-title white-text">Acciones de usuarios</span>
                                <table className="highlight">
                                    <thead>
                                        <tr className="white-text">
                                            <th>Nombre</th>
                                            <th>Apellido</th>
                                            <th>Rol</th>
                                            <th>Inicio de sesión</th>
                                            <th>Acciones</th>
                                            <th>Últ. vez</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            this.state.sessions.map(session => {
                                                return (
                                                    <tr key={session._id} className="white-text">
                                                        <td>{jwt_decode(session.userToken).firstName}</td>
                                                        <td>{jwt_decode(session.userToken).lastName}</td>
                                                        <td>{jwt_decode(session.userToken).role}</td>
                                                        <td>{session.dateSession}</td>
                                                        <td>{session.actions.map(action => {
                                                                return (
                                                                    <li key={action.toString()}>{action}</li>
                                                                )
                                                            })}
                                                        </td>
                                                        <td>
                                                            {session.dateActions && Moment(session.dateActions).calendar()}
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
    }
}
