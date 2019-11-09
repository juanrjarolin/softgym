import React, { Component } from 'react'
import axios from 'axios'
import {Link} from 'react-router-dom'

export default class Detalles extends Component {
    constructor(props){
        super(props)
        this.state = {
            detalles: [],
            idMantenimiento: ''
        }
    }

    componentDidMount(){
        this.handleFetchDetalles()
    }

    async handleFetchDetalles(){
        const {id} = this.props.match.params
        try {
            const res = await axios.get('http://localhost:4000/api/detalle-mantenimiento/' + id)
            console.log(res.data)
            this.setState({
                detalles: res.data
            })
        } catch (error) {
            
        }
    }

    render() {
        return (
            <div className="container py-5">
                <div className="row">
                    <div className="col-sm-12">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">Detalles</h5>
                                <table className="table table-hover table-dark">
                                    <thead>
                                        <tr>
                                            <th scope="col">Máquina</th>
                                            <th scope="col">Marca</th>
                                            <th scope="col">Categoría</th>
                                            <th scope="col">Detalle</th>
                                            <th scope="col">Costo de mantenimiento</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            this.state.detalles.map((detalle) => {
                                                return (
                                                    <tr key={detalle._id}>
                                                        <td>{detalle.maquina.nombre}</td>
                                                        <td>{detalle.maquina.marca}</td>
                                                        <td>{detalle.maquina.categoria.nombre}</td>
                                                        <td>{detalle.detalle}</td>
                                                        <td>{detalle.costo}</td>
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
                <div className="row py-2">
                    <div className="col-sm-12">
                        <Link className="btn btn-danger btn-sm" to="/mantenimiento">Atrás</Link>
                    </div>
                </div>
            </div>
        )
    }
}
