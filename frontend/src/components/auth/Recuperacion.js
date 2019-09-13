import React, { Component } from 'react'
import axios from 'axios'
import { NotificationContainer, NotificationManager } from 'react-notifications'

export default class Recuperacion extends Component {
    constructor(){
        super()
        this.state = {
            email: ''
        }
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleSubmit = async(e) => {
        e.preventDefault()
        const email = {
            email: this.state.email
        }

        try {
            const res = await axios.post('http://localhost:4000/api/account', email)
            if(res.data.success){

            }
        } catch (error) {
            
        }
    }

    render() {
        return (
            <div className="container py-5">
                <div className="row">
                    <div className="col-sm-4"></div>
                    <div className="col-sm-4">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">Recuperación de contraseña</h5>
                                <form id="form" onSubmit={this.handleSubmit}>
                                    <div className="row">
                                        <div className="form-group col-sm-10">
                                            <label htmlFor="email">Correo electrónico</label>
                                            <input type="email" name="email" id="email"placeholder="Introduzca su email" className="form-control form-control-sm" required value={this.state.email} onChange={this.handleChange}/>
                                        </div>
                                        <div className="form-group col-sm-10">
                                            <button type="submit" className="btn btn-primary btn-sm">Enviar</button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
