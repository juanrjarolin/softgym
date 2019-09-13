import React, { Component } from 'react'
import axios from 'axios';
import { NotificationContainer, NotificationManager } from 'react-notifications'
import ChangePassword from './ChangePassword'
import Login from './Login'

var style = {
    backgroundColor: 'rgba(0, 0, 0, .6)'
}

export default class Signin extends Component {
    constructor() {
        super()
        this.state = {
            showChangePassword: false,
            showLogin: true,
            user: {}
        }
        //this.handleChange = this.handleChange.bind(this)
        //this.handleSubmit = this.handleSubmit.bind(this)
    }

    componentDidMount(){
        var token = localStorage.getItem('usertoken')
        if(token){
            this.setState({
                showLogin: false
            })
            this.props.history.push(`/`)
        }
    }

    handleChangePassword = async (e, args) => {
        e.preventDefault()
        if(args.password1 === args.password2){
            const newUser = {
                firstName: this.state.user.firstName,
                lastName: this.state.user.lastName,
                email: this.state.user.email,
                password: args.password1,
                role: this.state.user.role,
                isPassChanged: true
            }
            await axios.put('http://localhost:4000/api/account/changepassword/' + this.state.user._id, newUser)
                .then(res => {
                    if(res.data.success){
                        NotificationManager.success(res.data.message, 'Cambio de Contraseña')
                        this.setState({
                            showLogin: true,
                            showChangePassword: false
                        })
                    }
                })
        }else{
            NotificationManager.error('Las contraseñas no coinciden', 'Error')
        }
    }

    handleLogin = async (e, args) => {
        e.preventDefault()

        const user = {
            email: args.email,
            password: args.password
        }

        await axios.post('http://localhost:4000/api/account/signin', user)
            .then(res => {
                if (res.data.success === false) {
                    NotificationManager.error(res.data.message, 'Error')
                } else {
                    if (res.data.success === 'warning') {
                        NotificationManager.warning(res.data.message, 'Atención')
                        this.setState({
                            showChangePassword: true,
                            showLogin: false,
                            user: res.data.data
                        })
                    } else {
                        localStorage.setItem('usertoken', res.data)
                        this.props.history.push(`/`)
                        return res.data
                    }
                }
            })
            .catch(err => {
                NotificationManager.error('Ha ocurrido un error al conectar con el servidor', 'Error')
            })
    }

    render() {
        const {showChangePassword, showLogin} = this.state

        return (
            <div className="container p-5 animated bounceInDown">
                <div className="row">
                    <div className="col-sm-4"></div>
                    <div className="card col-sm-4" style={style}>
                        {showLogin && <Login handleSubmit={this.handleLogin}/>}
                        {showChangePassword && <ChangePassword handleSubmit={this.handleChangePassword} />}
                    </div>
                </div>
                <NotificationContainer />
            </div>
        )
    }
}
