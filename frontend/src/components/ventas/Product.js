import React, { Component } from 'react'
import axios from 'axios'
import { NotificationContainer, NotificationManager } from 'react-notifications'

export default class Product extends Component {
    constructor() {
        super()
        this.state = {
            cliente: 'Elija un cliente',
            tipoVenta: 'Elija una opción',
            sucursal: 'Elija una sucursal',
            cantidad: '',
            producto: 'Elija un producto',
            precio: '',
            productos: [],
            detalles: [],
            sucursales: [],
            _id: '',
            editing: false,
            productId: ''
        }
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleSubmit = async (e) => {
        e.preventDefault()
        let product = ''
        if(this.state.editing){
            product = this.state.productId
        }else{
            product = this.state.producto
        }

        const venta = {
            cliente: this.state.cliente,
            tipo_venta: this.state.tipoVenta,
            cantidad: this.state.cantidad,
            producto: product
        }

        try {
            if(this.state.editing){
                const res = await axios.put('http://localhost:4000/api/ventas/' + this.state._id, venta)
                if(res.data.success){
                    NotificationManager.success(res.data.message, 'Venta')
                    this.setState({
                        tipoVenta: 'Elija una opción',
                        cantidad: '',
                        cliente: 'Elija un cliente',
                        producto: 'Elija un producto',
                        _id: '',
                        editing: false,
                        productId: ''
                    })
                    this.fetchDetalles()
                    document.getElementById('form').reset()
                }else{
                    NotificationManager.error('Ocurrio un error', 'Error')
                }
            }else{
                const respuesta = await axios.post('http://localhost:4000/api/ventas', venta)
                if (respuesta.data.success) {
                    NotificationManager.success(respuesta.data.message, 'Venta')
                    this.fetchDetalles()
                }
            }
        } catch (error) {
            NotificationManager.error('Ha ocurrido un error', 'Venta')
        }
    }

    componentDidMount() {
        this.fetchProduct()
        this.fetchDetalles()
    }

    async fetchProduct() {
        try {
            const productos = await axios.get('http://localhost:4000/api/products')
            this.setState({
                productos: productos.data
            })
        } catch (error) {
            NotificationManager.error('Ha ocurrido un error', 'Error')
        }
    }

    async fetchSucursales(){
        try {
            const sucursales = await axios.get('http://localhost:4000/api/sucursales')
            this.setState({
                sucursales: sucursales.data
            })
        } catch (error) {
            NotificationManager.error()
        }
    }

    async fetchDetalles() {
        try {
            const res = await axios.get('http://localhost:4000/api/detalle-ventas')
            this.setState({
                detalles: res.data
            })
        } catch (error) {
            NotificationManager.error('Ha ocurrido un error', 'Error')
        }
    }

    async editVenta(id){
        try {
            const res = await axios.get('http://localhost:4000/api/detalle-ventas/' + id)
            this.setState({
                tipoVenta: res.data.venta.tipo_venta,
                cantidad: res.data.cantidad,
                cliente: res.data.venta.cliente,
                producto: res.data.producto.nombre,
                _id: res.data.venta._id,
                editing: true,
                productId: res.data.producto._id
            })
        } catch (error) {
            NotificationManager.error('Ha ocurrido un error', 'Error')
        }
    }

    async deleteVenta(id){
        try {
            const res = await axios.delete('http://localhost:4000/api/ventas/' + id)
            if(res.data.success){
                NotificationManager.success(res.data.message, 'Venta')
                this.fetchDetalles()
            }
        } catch (error) {
            NotificationManager.error('Ha ocurrido un error', 'Error')            
        }
    }

    render() {
        return (
            <div className="container py-5">
                <div className="row">
                    <div className="col-sm-4">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">Venta de productos</h5>
                                <form id="form" onSubmit={this.handleSubmit}>
                                    <div className="row">
                                        <div className="form-group col-sm-6">
                                            <label htmlFor="cliente">Cliente</label>
                                            <select className="form-control" name="cliente" id="cliente" onChange={this.handleChange} defaultValue={this.state.cliente}>
                                                <option value={this.state.cliente} disabled>{this.state.cliente}</option>
                                                <option value="pedro">Pedro</option>
                                                <option value="pepito">Pepito</option>
                                            </select>
                                        </div>
                                        <div className="form-group col-sm-6">
                                            <label htmlFor="tipoVenta">Tipo de venta</label>
                                            <select className="form-control" name="tipoVenta" id="tipoVenta" onChange={this.handleChange} defaultValue={this.state.tipoVenta}>
                                                <option disabled value={this.state.tipoVenta}>{this.state.tipoVenta}</option>
                                                <option value="Contado">Contado</option>
                                                <option value="Credito">Credito</option>
                                            </select>
                                        </div>
                                        <div className="form-group col-sm-6">
                                            <label htmlFor="producto">Producto</label>
                                            <select className="form-control" name="producto" id="producto" onChange={this.handleChange} defaultValue={this.state.productId}>
                                                <option disabled value={this.state.productId}>{this.state.producto}</option>
                                                {
                                                    this.state.productos.map(producto => {
                                                        return (
                                                            <option key={producto._id} value={producto._id}>{producto.nombre}</option>
                                                        )
                                                    })
                                                }
                                            </select>
                                        </div>
                                        <div className="form-group col-sm-6">
                                            <label htmlFor="cantidad">Cantidad</label>
                                            <input type="number" className="form-control" name="cantidad" id="cantidad" onChange={this.handleChange} value={this.state.cantidad}/>
                                        </div>
                                        <div className="form-group col-sm-6">
                                            <label htmlFor="sucursal">Sucursal</label>
                                            <select className="form-control" name="sucursal" id="sucursal" onChange={this.handleChange} defaultValue="0">
                                                <option value="0" disabled>{this.state.sucursal}</option>
                                                <option value="ita">Ita</option>
                                                <option value="sanloren">San Lorenzo</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="form-group col-sm-6">
                                            <button type="submit" className="btn btn-primary">Guardar</button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-8">
                        <div className="card">
                            <h5 className="card-header">Detalle de ventas productos</h5>
                            <div className="card-body">
                                <table className="table table-striped table-dark">
                                    <thead>
                                        <tr>
                                            <th scope="col">Factura</th>
                                            <th scope="col">Cliente</th>
                                            <th scope="col">Producto</th>
                                            <th scope="col">Cantidad</th>
                                            <th scope="col">Precio</th>
                                            <th scope="col">Monto total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            this.state.detalles.map(detalle => {
                                                return (
                                                    <tr key={detalle._id}>
                                                        <td>{detalle.venta.num_factura}</td>
                                                        <td>{detalle.venta.cliente}</td>
                                                        <td>{detalle.producto.nombre}</td>
                                                        <td>{detalle.cantidad}</td>
                                                        <td>{detalle.precio}</td>
                                                        <td>{detalle.venta.monto_total}</td>
                                                        <td>
                                                            <button className="btn btn-primary btn-sm">
                                                                <i className="material-icons" onClick={() => this.editVenta(detalle._id)}>edit</i>
                                                            </button>
                                                            <button className="btn btn-danger btn-sm" style={{margin: '4px'}}>
                                                                <i className="material-icons" onClick={() => this.deleteVenta(detalle.venta._id)}>delete</i>
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
