import React, { Component } from 'react'
//import jwt_decode from 'jwt-decode'

export default class Profile extends Component {
    constructor(){
        super()
        this.state = {
            firstName: '',
            lastName: '',
            'email': ''
        }
    }

    componentDidMount(){
        try {
            //const token = localStorage.usertoken
            //const decode = jwt_decode(token)
            
        } catch (error) {
            this.props.history.push(`/signin`)
        }
        
    }

    render() {
        return (
            <div className="container">
                <div className="jumbotron mt-5">
                    <div className="col-sm-8 mx-auto">
                        <h1 className="text-center">Perfil</h1>
                    </div>
                    <div className="table col-md-6 mx-auto">
                        <tbody>
                            <tr>
                                <td>Nombre</td>
                                <td>{this.state.firstName}</td>
                            </tr>
                            <tr>
                                <td>Apellido</td>
                                <td>{this.state.lastName}</td>
                            </tr>
                            <tr>
                                <td>Nombre de usuario</td>
                                <td>{this.state.email}</td>
                            </tr>
                        </tbody>
                    </div>
                </div>
            </div>
        )
    }
}
