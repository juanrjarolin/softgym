import React, { Component } from 'react'
import M from 'materialize-css/dist/js/materialize.min.js'
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
        this.fetchProducts()
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
            document.getElementById('form').reset();
            const product = await axios.get('http://localhost:4000/api/products/' + id)
            this.setState({
                name: product.data.name,
                price: product.data.price,
                cost: product.data.cost,
                minimumStock: product.data.minimumStock,
                _id: product.data._id,
                editing: true
            })
            M.updateTextFields();
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
            name: this.state.name,
            price: this.state.price,
            cost: this.state.cost,
            minimumStock: this.state.minimumStock
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
                M.updateTextFields();
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
                    M.updateTextFields();
                    NotificationManager.success(res.data.message, 'Registro')
                }
            }

        } catch (error) {
            console.log('Error')
        }
    }

    render() {
        return (
            <div className="section container">
                <div className="row">
                    <div className="col s4">
                        <div className="card">
                            <div className="card-content">
                                <span className="card-title white-text">Registro de productos</span>
                                <form onSubmit={this.handleSubmit} id="form">
                                    <div className="row">
                                        <div className="input-field col s12">
                                            <label htmlFor="name">Nombre</label>

                                            <input type="text" minLength="3" maxLength="15" id="name" onChange={this.handleChange} name="name" className="validate white-text" required pattern="[A-Za-z]+" title="Se requiere caracteres alfabéticos min: 3 y máx: 15" autoComplete="off" value={this.state.name} />

                                            <span className="helper-text" data-error="Incorrecto" data-success="Correcto"></span>
                                        </div>
                                        <div className="input-field col s12">
                                            <label htmlFor="price">Precio</label>

                                            <input type="number" id="price" onChange={this.handleChange} name="price" className="validate white-text" required pattern="[A-Za-z]+" title="Se requiere caracteres alfabéticos min: 3 y máx: 15" autoComplete="off" value={this.state.price} />

                                            <span className="helper-text" data-error="Incorrecto" data-success="Correcto"></span>
                                        </div>
                                        <div className="input-field col s12">
                                            <label htmlFor="cost">Costo</label>

                                            <input type="number" id="cost" onChange={this.handleChange} name="cost" className="validate white-text" required pattern="[A-Za-z]+" title="Se requiere caracteres alfabéticos min: 3 y máx: 15" autoComplete="off" value={this.state.cost} />

                                            <span className="helper-text" data-error="Incorrecto" data-success="Correcto"></span>
                                        </div>
                                        <div className="input-field col s12">
                                            <label htmlFor="minimumStock">Stock mínimo</label>

                                            <input type="number" id="minimumStock" onChange={this.handleChange} name="minimumStock" className="validate white-text" required pattern="[A-Za-z]+" title="Se requiere caracteres alfabéticos min: 3 y máx: 15" autoComplete="off" value={this.state.minimumStock} />

                                            <span className="helper-text" data-error="Incorrecto" data-success="Correcto"></span>
                                        </div>
                                    </div>
                                    <button type="submit" className="btn waves-effect waves-light btn-small center-align" name="action">Guardar</button>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div className="col s8">
                        <div className="card">
                            <div className="card-content">
                                <span className="card-title white-text">Productos</span>
                                <table className="highlight">
                                    <thead>
                                        <tr className="white-text">
                                            <th>Nombre</th>
                                            <th>Precio</th>
                                            <th>Costo</th>
                                            <th>Stock mínimo</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            this.state.products.map(product => {
                                                return (
                                                    <tr key={product._id} className="white-text">
                                                        <td>{product.name}</td>
                                                        <td>{product.price}</td>
                                                        <td>{product.cost}</td>
                                                        <td>{product.minimumStock}</td>
                                                        <td>
                                                            <button className="btn waves-effect waves-light btn-small">
                                                                <i className="material-icons" onClick={() => this.editProduct(product._id)}>edit</i>
                                                            </button>
                                                            <button className="btn waves-effect waves-light btn-small" style={{ margin: '4px' }}>
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
    }
}
