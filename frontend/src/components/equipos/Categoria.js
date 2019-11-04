import React, { Component } from 'react'
import axios from 'axios'
import { NotificationContainer, NotificationManager } from 'react-notifications'
import jwt_decode from 'jwt-decode'
import Security from '../security/Security'

export default class Categoria extends Component {
    constructor(props) {
        super(props)
        this.state = {
            categorias: [],
            nombre: '',
            _id: '',
            editing: false,
            isLoading: false,
            showRegistro: false,
            showVisualizacion: false,
            showEdit: false,
            showDelete: false
        }
    }

    componentDidMount() {
        var token = localStorage.getItem('usertoken')
        if (token) {
            //decodifica el token
            const decode = jwt_decode(token)
            if (decode.permisos.crearCategoriaMaquina) {
                this.setState({
                    showRegistro: true,
                    isLoading: true
                })
            }
            if (decode.permisos.visualizarCategoriaMaquina) {
                this.setState({
                    showVisualizacion: true,
                    isLoading: true
                })
                //se actualizan las listas del state
                this.fetchCategorias()
                //estable un headers por defecto con el token obtenido
                axios.defaults.headers.common['Authorization'] = token
            }
            if (decode.permisos.editarCategoriaMaquina) {
                this.setState({
                    showEdit: true,
                    isLoading: true
                })
            }

            if (decode.permisos.eliminarCategoriaMaquina) {
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

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleSubmit = async (e) => {
        e.preventDefault()
        const categoria = {
            nombre: this.state.nombre
        }

        try {
            if (this.state.editing) {
                const result = await axios.put('http://localhost:4000/api/categoriaMaquinas/' + this.state._id, categoria)
                if (result.data.success) {
                    this.setState({
                        nombre: '',
                        _id: '',
                        editing: false
                    })
                    this.fetchCategorias()
                    document.getElementById('form').reset()
                    NotificationManager.success(result.data.message, 'Registro de categoría')
                } else {
                    NotificationManager.error(result.data.message, 'Registro de categoría')
                }
            } else {
                const result = await axios.post('http://localhost:4000/api/categoriaMaquinas', categoria)
                if (result.data.success) {
                    this.setState({
                        nombre: ''
                    })
                    this.fetchCategorias()
                    document.getElementById('form').reset()
                    NotificationManager.success(result.data.message, 'Registro de categoría')
                } else {
                    NotificationManager.error(result.data.message, 'Registro de categoría')
                }
            }
        } catch (error) {
            NotificationManager.error('Ha ocurrido un error', 'Registro de categoría')
        }
    }

    async fetchCategorias() {
        try {
            const categorias = await axios.get('http://localhost:4000/api/categoriaMaquinas')
            this.setState({
                categorias: categorias.data,
                isLoading: true
            })
        } catch (error) {
            this.setState({
                isLoading: false
            })
        }
    }

    async editCategoria(id) {
        try {
            const result = await axios.get('http://localhost:4000/api/categoriaMaquinas/' + id)
            this.setState({
                nombre: result.data.nombre,
                _id: result.data._id,
                editing: true
            })
        } catch (error) {
            NotificationManager.error('Ha ocurrido un error', 'Error')
        }
    }

    async deleteCategoria(id) {
        try {
            const result = await axios.delete('http://localhost:4000/api/categoriaMaquinas/' + id)
            if (result.data.success) {
                this.fetchCategorias()
                NotificationManager.success(result.data.message, 'Eliminación de categoría')
            }
        } catch (error) {
            NotificationManager.error('Ha ocurrido un error', 'Error')
        }
    }

    render() {
        const { isLoading, showDelete, showEdit, showRegistro, showVisualizacion } = this.state

        const registro = (
            <div className="col-sm-5">
                <div className="card">
                    <div className="card-body">
                        <h5 className="card-title">Registro de Categorías</h5>
                        <form onSubmit={this.handleSubmit} id="form">
                            <div className="row">
                                <div className="form-group col-sm-10">
                                    <label htmlFor="nombre">Nombre</label>
                                    <input type="text" name="nombre" id="nombre" placeholder="Ingrese el nombre de la categoría" className="form-control form-control-sm" required autoComplete="off" onChange={this.handleChange} value={this.state.nombre} />
                                </div>
                                <div className="form-group col-sm-10">
                                    <button type="submit" className="btn btn-primary btn-sm">Guardar</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )

        const visualizar = (
            <div className="col-sm-7">
                <div className="card">
                    <div className="card-body">
                        <h5 className="card-title">Categorías de Máquinas</h5>
                        <table className="table table-hover table-dark">
                            <thead>
                                <tr>
                                    <th scope="col">Nombre de la categoría</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    this.state.categorias.map(categoria => {
                                        return (
                                            <tr key={categoria._id}>
                                                <td>{categoria.nombre}</td>
                                                <td>
                                                    {showEdit && <button className="btn btn-primary btn-sm">
                                                        <i className="material-icons" onClick={() => this.editCategoria(categoria._id)}>edit</i>
                                                    </button>}
                                                    {showDelete && <button className="btn btn-danger btn-sm" style={{ margin: '4px' }}>
                                                        <i className="material-icons" onClick={() => this.deleteCategoria(categoria._id)}>delete</i>
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
        
        if(isLoading){
            return (
                <div className="container py-5">
                    <div className="row">
                        {showRegistro && registro}
                        {showVisualizacion && visualizar}
                    </div>
                    <NotificationContainer />
                </div>
            )
        }else{
            return (
                <Security />
            )
        }
    }
}
