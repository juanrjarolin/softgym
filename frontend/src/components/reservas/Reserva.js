import React, { Component } from 'react'
import axios from 'axios'
import { NotificationContainer, NotificationManager } from 'react-notifications'
import jwt_decode from 'jwt-decode'

export default class Reserva extends Component {
    constructor(){
        super()
        this.state = {
            clases: [],
            estado: '',
            id: ''
        }
    }

    componentDidMount(){
        try {
            var token = localStorage.getItem('usertoken')
            if(token){
                const decode = jwt_decode(token)
                this.cargarCliente(decode._id)
            }
        } catch (error) {
            
        }
        this.fetchClases()
    }

    cargarCliente(id){
        this.setState({
            id: id
        })
    }

    async fetchClases() {
        try {
            const result = await axios.get('http://localhost:4000/api/clases')
            this.setState({
                clases: result.data
            })
        } catch (error) {
            NotificationManager.error('Ha ocurrido un error al conectarse al servidor', 'Error')
        }
    }

    async reservarClase(id){
        const cliente = this.state.id
        const clase = id
        const sucursal = "5d6867dc24ec8a47081cb221"
        const reserva = {
            cliente,
            clase,
            sucursal
        }

        try {
            const result = await axios.post('http://localhost:4000/api/reservas', reserva)
            if(result.data.success){
                this.fetchClases()
                NotificationManager.success(result.data.message, 'Reserva')
            }else{
                NotificationManager.error(result.data.message, 'Reserva')
            }
        } catch (error) {
            NotificationManager.error('Ha ocurrido un error', 'Reserva')
        }
    }

    async cancelarReserva(id){
        try {
            const result = await axios.delete('http://localhost:4000/api/reservas/' + id);
            if(result.data.success){
                this.fetchClases()
                NotificationManager.success(result.data.message, 'Reserva')
            }else{
                NotificationManager.error(result.data.message, 'Reserva')
            }
        } catch (error) {
            NotificationManager.error('Ha ocurrido un error', 'Reserva')
        }
    }

    render() {
        return (
            <div className="container py-5">
                <div className="row">
                    <div className="col-sm-12">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title white-text">Reservas</h5>
                                <table className="table table-striped table-dark">
                                    <thead>
                                        <tr>
                                            <th>Clase</th>
                                            <th>Días</th>
                                            <th>Horario</th>
                                            <th>Estado</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            this.state.clases.map(clase => {
                                                return (
                                                    <tr key={clase._id}>
                                                        <td>{clase.nombre}</td>
                                                        <td>{clase.dias}</td>
                                                        <td>{clase.horario}</td>
                                                        <td>{clase.estado}</td>
                                                        <td>
                                                            <button className="btn btn-primary btn-sm" title="Reservar clase">
                                                                <i className="material-icons" onClick={() => this.reservarClase(clase._id)}>done</i>
                                                            </button>
                                                            <button className="btn btn-danger btn-sm" style={{ margin: '4px' }} title="Cancelar reserva">
                                                                <i className="material-icons" onClick={() => this.cancelarReserva(clase._id)}>cancel</i>
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
