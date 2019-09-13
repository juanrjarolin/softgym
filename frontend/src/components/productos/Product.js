import React, { Component } from 'react'
import axios from 'axios'
import { NotificationContainer, NotificationManager } from 'react-notifications'
import jwt_decode from 'jwt-decode'
import Security from '../security/Security'

export default class Product extends Component {
    constructor() {
        super()
        this.state = {
            name: '',
            price: '',
            cost: '',
            minimumStock: '',
            isLoading: true,
            _id: '',
            products: [],
            editing: false
        }
    }

    componentDidMount() {
        var token = localStorage.getItem('usertoken')
        if (token) {
            //decodifica el token
            const decode = jwt_decode(token)
            if (decode.role === 'administrador' || decode.role === "vendedor") {
                //estable un headers por defecto con el token obtenido
                axios.defaults.headers.common['Authorization'] = token

                //se actualizan las listas del state
                this.fetchProducts()

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

    async fetchProducts() {
        try {
            const products = await axios.get('http://localhost:4000/api/products')
            this.setState({
                products: products.data
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

    async editProduct(id) {
        try {
            const product = await axios.get('http://localhost:4000/api/products/' + id)
            this.setState({
                name: product.data.nombre,
                price: product.data.precio,
                cost: product.data.costo,
                minimumStock: product.data.stockMinimo,
                _id: product.data._id,
                editing: true
            })
        } catch (error) {
            console.log('error')
        }
    }

    async deleteProduct(id) {
        try {
            const res = await axios.delete('http://localhost:4000/api/products/' + id)
            if (res.data.success === true) {
                this.fetchProducts()
                NotificationManager.success(res.data.message, 'Producto')
            }
        } catch (error) {
            console.log('Error')
        }
    }

    handleSubmit = async (e) => {
        e.preventDefault()
        const product = {
            nombre: this.state.name,
            precio: this.state.price,
            costo: this.state.cost,
            stockMinimo: this.state.minimumStock
        }
        try {
            if (this.state.editing) {
                await axios.put('http://localhost:4000/api/products/' + this.state._id, product)
                this.fetchProducts()
                this.setState({
                    name: '',
                    price: '',
                    cost: '',
                    minimumStock: '',
                    _id: '',
                    editing: false
                })
                document.getElementById('form').reset();
                NotificationManager.success('Actualización realizada con éxito', 'Registro')
            } else {
                const res = await axios.post('http://localhost:4000/api/products', product)
                if (res.data.success === false) {
                    NotificationManager.error(res.data.message, 'Registro')
                } else {
                    this.setState({
                        name: '',
                        price: '',
                        cost: '',
                        minimumStock: ''
                    })
                    this.fetchProducts()
                    document.getElementById('form').reset();
                    NotificationManager.success(res.data.message, 'Registro')
                }
            }

        } catch (error) {
            console.log('Error')
        }
    }

    render() {
        const {isLoading} = this.state
        if(isLoading){
            return (
                <div className="container py-5">
                    <div className="row">
                        <div className="col-sm-4">
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title">Registro de productos</h5>
                                    <form onSubmit={this.handleSubmit} id="form">
                                        <div className="row">
                                            <div className="form-group col-sm-10">
                                                <label htmlFor="name">Nombre</label>
    
                                                <input type="text" minLength="3" maxLength="15" id="name" onChange={this.handleChange} name="name" className="form-control form-control-sm validate" required pattern="[A-Za-z]+" title="Se requiere caracteres alfabéticos min: 3 y máx: 15" autoComplete="off" value={this.state.name} placeholder="Ingrese el nombre del producto"/>
    
                                            </div>
                                            <div className="form-group col-sm-10">
                                                <label htmlFor="price">Precio</label>
    
                                                <input type="number" id="price" onChange={this.handleChange} name="price" className="form-control form-control-sm validate" required pattern="[A-Za-z]+" title="Se requiere caracteres alfabéticos min: 3 y máx: 15" autoComplete="off" value={this.state.price} placeholder="Ingrese el precio del producto"/>
    
                                            </div>
                                            <div className="form-group col-sm-10">
                                                <label htmlFor="cost">Costo</label>
    
                                                <input type="number" id="cost" onChange={this.handleChange} name="cost" className="form-control form-control-sm validate" required pattern="[A-Za-z]+" title="Se requiere caracteres alfabéticos min: 3 y máx: 15" autoComplete="off" value={this.state.cost} placeholder="Ingrese el costo del producto"/>
    
                                            </div>
                                            <div className="form-group col-sm-10">
                                                <label htmlFor="minimumStock">Stock mínimo</label>
    
                                                <input type="number" id="minimumStock" onChange={this.handleChange} name="minimumStock" className="form-control form-control-sm validate" required pattern="[A-Za-z]+" title="Se requiere caracteres alfabéticos min: 3 y máx: 15" autoComplete="off" value={this.state.minimumStock} placeholder="Ingrese el stock minimo"/>
    
                                            </div>
                                            <div className="form-group col-sm-10">
                                                <button type="submit" className="btn btn-primary btn-sm" name="action">Guardar</button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-8">
                            <div className="card">
                                <div className="card-header">Listado de productos</div>
                                <div className="card-body">
                                    <table className="table table-hover table-dark">
                                        <thead>
                                            <tr>
                                                <th scope="col">Nombre</th>
                                                <th scope="col">Precio</th>
                                                <th scope="col">Costo</th>
                                                <th scope="col">Stock mínimo</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                this.state.products.map(product => {
                                                    return (
                                                        <tr key={product._id}>
                                                            <td>{product.nombre}</td>
                                                            <td>{product.precio}</td>
                                                            <td>{product.costo}</td>
                                                            <td>{product.stockMinimo}</td>
                                                            <td>
                                                                <button className="btn btn-primary btn-sm">
                                                                    <i className="material-icons" onClick={() => this.editProduct(product._id)}>edit</i>
                                                                </button>
                                                                <button className="btn btn-danger btn-sm" style={{ margin: '4px' }}>
                                                                    <i className="material-icons" onClick={() => this.deleteProduct(product._id)}>delete</i>
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
        }else{
            return (
                <Security />
            )
        }
    }
}
