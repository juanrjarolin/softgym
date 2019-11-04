import React, { Component } from 'react'
import axios from 'axios'
import { NotificationContainer, NotificationManager } from 'react-notifications'
import jwt_decode from 'jwt-decode'
import Security from '../security/Security'

export default class Equipo extends Component {
    constructor() {
        super()
        this.state = {
            nombre: '',
            cod_equipo: '',
            costo: '',
            marca: '',
            categoria: '',
            descripcion: '',
            estadoCompra: '',
            _id: '',
            editing: false,
            equipos: [],
            categorias: [],
            isLoading: false,
            showRegistro: false,
            showVisualizacion: false,
            showEdit: false,
            showDelete: false,
            showMasInfo: false,
            equipo: {},
            periodoMantenimiento: '',
            pertenencia: ''
        }
    }

    componentDidMount() {
        var token = localStorage.getItem('usertoken')
        if (token) {
            //decodifica el token
            const decode = jwt_decode(token)
            if (decode.permisos.crearMaquina) {
                this.setState({
                    showRegistro: true,
                    isLoading: true
                })
                this.fetchCategorias()
            }
            if (decode.permisos.visualizarMaquina) {
                this.setState({
                    showVisualizacion: true,
                    isLoading: true
                })
                this.fetchEquipos()
                //estable un headers por defecto con el token obtenido
                axios.defaults.headers.common['Authorization'] = token
            }
            if (decode.permisos.editarMaquina) {
                this.setState({
                    showEdit: true,
                    isLoading: true
                })
            }

            if (decode.permisos.eliminarMaquina) {
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

    async fetchEquipos() {
        try {
            const equipos = await axios.get('http://localhost:4000/api/equipos')
            this.setState({
                equipos: equipos.data,
                isLoading: true
            })
        } catch (error) {
            this.setState({
                isLoading: false
            })
        }
    }

    async fetchCategorias() {
        try {
            const categorias = await axios.get('http://localhost:4000/api/categoriaMaquinas')
            if (categorias.data.length === 0) {
                NotificationManager.info('Debe crear al menos una categoría', 'Atención');
            }
            this.setState({
                categorias: categorias.data
            })
        } catch (error) {
            NotificationManager.error('Ocurrió un error al obtener las categorias', 'Error')
        }
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleSubmit = async (e) => {
        e.preventDefault()
        const equipo = {
            nombre: this.state.nombre,
            cod_equipo: this.state.cod_equipo,
            costo: this.state.costo,
            marca: this.state.marca,
            categoria: this.state.categoria,
            descripcion: this.state.descripcion,
            estadoCompra: this.state.estadoCompra,
            periodoMantenimiento: this.state.periodoMantenimiento
        }

        try {
            if (this.state.editing) {
                const result = await axios.put('http://localhost:4000/api/equipos/' + this.state._id, equipo)
                if (result.data.success) {
                    NotificationManager.success(result.data.message, 'Actualización')
                    this.setState({
                        nombre: '',
                        cod_equipo: '',
                        costo: '',
                        descripcion: '',
                        marca: '',
                        estadoCompra: '',
                        periodoMantenimiento: '',
                        pertenencia: '',
                        categoria: '',
                        _id: '',
                        editing: false
                    })
                    this.fetchEquipos()
                    document.getElementById('form').reset()
                }
            } else {
                const result = await axios.post('http://localhost:4000/api/equipos', equipo)
                if (result.data.success === false) {
                    NotificationManager.error(result.data.message, 'Registro')
                } else {
                    NotificationManager.success(result.data.message, 'Registro')
                    this.setState({
                        nombre: '',
                        cod_equipo: '',
                        costo: '',
                        descripcion: '',
                        marca: '',
                        categoria: '',
                        estadoCompra: '',
                        periodoMantenimiento: '',
                        pertenencia: ''
                    })
                    this.fetchEquipos()
                    document.getElementById('form').reset()
                }
            }
        } catch (error) {
            NotificationManager.error('Error', 'Registro')
        }

    }

    async editEquipo(id) {
        try {
            const equipo = await axios.get('http://localhost:4000/api/equipos/' + id)
            this.setState({
                nombre: equipo.data.nombre,
                cod_equipo: equipo.data.cod_equipo,
                costo: equipo.data.costo,
                descripcion: equipo.data.descripcion,
                marca: equipo.data.marca,
                categoria: equipo.data.categoria,
                estadoCompra: equipo.data.estadoCompra,
                periodoMantenimiento: equipo.data.periodoMantenimiento,
                pertenencia: equipo.data.pertenencia,
                _id: equipo.data._id,
                editing: true
            })
        } catch (error) {
            NotificationManager.error('Ha ocurrido un error', 'Registro')
        }
    }

    async deleteEquipo(id) {
        try {
            const result = await axios.delete('http://localhost:4000/api/equipos/' + id)
            if (result.data.success) {
                this.fetchEquipos()
                NotificationManager.success(result.data.message, 'Registro')
            }
        } catch (error) {
            NotificationManager.error('Ha ocurrido un error', 'Registro')
        }
    }

    async mostrarInfo(id){
        try {
            const result = await axios.get('http://localhost:4000/api/equipos/' + id)
            this.setState({
                showMasInfo: true,
                showRegistro: false,
                showVisualizacion: false,
                equipo: result.data
            })
        } catch (error) {
            NotificationManager.error('No se pudo obtener el equipo', 'Error')
        }
    }

    regresar(){
        this.setState({
            showMasInfo: false,
            showRegistro: true,
            showVisualizacion: true
        })
    }

    render() {
        const { isLoading, showDelete, showEdit, showRegistro, showVisualizacion, showMasInfo } = this.state

        const registro = (
            <div className="col-sm-4">
                <div className="card">
                    <div className="card-body">
                        <h5 className="card-title">Registro de máquinas</h5>
                        <form onSubmit={this.handleSubmit} id="form">
                            <div className="row">
                                <div className="form-group col-sm-10">
                                    <select className="form-control form-control-sm" name="categoria" onChange={this.handleChange} required>
                                        <option defaultValue>Seleccione una categoría</option>
                                        {
                                            this.state.categorias.map(categoria => {
                                                return (
                                                    <option key={categoria._id} value={categoria._id}>{categoria.nombre}</option>
                                                )
                                            })
                                        }
                                    </select>
                                </div>
                                <div className="form-group col-sm-10">
                                    <select className="form-control form-control-sm" name="pertenencia" onChange={this.handleChange} required>
                                        <option defaultValue>Seleccione una opción</option>
                                        <option value="Propio">Propio</option>
                                        <option value="Alquilado">Alquilado</option>
                                    </select>
                                </div>
                                <div className="form-group col-sm-10">
                                    <label htmlFor="nombre">Nombre</label>

                                    <input type="text" minLength="3" maxLength="15" onChange={this.handleChange} name="nombre" id="nombre" className="form-control form-control-sm validate" required pattern="[A-Za-z]+" title="Ingrese nombre del equipo" autoComplete="off" value={this.state.nombre} placeholder="Ingrese el nombre de la máquina" />

                                </div>
                                <div className="form-group col-sm-10">
                                    <label htmlFor="cod_equipo">Código del equipo</label>

                                    <input type="text" minLength="3" maxLength="15" onChange={this.handleChange} name="cod_equipo" id="cod_equipo" className="form-control form-control-sm validate" required pattern="[A-Za-z]+" title="Ingrese el codigo del equipo" autoComplete="off" value={this.state.cod_equipo} placeholder="Ingrese el código de la máquina" />

                                </div>
                                <div className="form-group col-sm-10">
                                    <label htmlFor="marca">Marca</label>

                                    <input type="text" minLength="3" maxLength="15" onChange={this.handleChange} name="marca" id="marca" className="form-control form-control-sm validate" required pattern="[A-Za-z]+" title="Ingrese la marca del equipo" autoComplete="off" value={this.state.marca} placeholder="Ingrese una marca" />
                                </div>

                                <div className="form-group col-sm-10">
                                    <label htmlFor="costo">Costo</label>

                                    <input type="number" onChange={this.handleChange} name="costo" id="costo" className="form-control form-control-sm validate" required pattern="[A-Za-z]+" title="Ingrese costo del equipo" autoComplete="off" value={this.state.costo} placeholder="Ingrese el costo de la máquina" />

                                </div>
                                <div className="form-group col-sm-10">
                                    <label htmlFor="estadoCompra">Estado de la máquina (compra)</label>

                                    <input type="text" onChange={this.handleChange} name="estadoCompra" id="estadoCompra" className="form-control form-control-sm validate" required title="Ingrese el estado inicial de la máquina" autoComplete="off" value={this.state.estadoCompra} placeholder="Ingrese el estado de la máquina" />

                                </div>
                                <div className="form-group col-sm-10">
                                    <label htmlFor="periodoMantenimiento">Periodo de mantenimiento</label>

                                    <input type="text" onChange={this.handleChange} name="periodoMantenimiento" id="periodoMantenimiento" className="form-control form-control-sm validate" required title="Ingrese el periodo de mantenimiento en meses" autoComplete="off" value={this.state.periodoMantenimiento} placeholder="Periodo de mantenimiento (meses)" />
                                </div>
                                <div className="form-group col-sm-10">
                                    <label htmlFor="descripcion">Descripción</label>
                                    <textarea className="form-control form-control-sm" name="descripcion" id="descripcion" onChange={this.handleChange} value={this.state.descripcion} placeholder="Agregue una descripción de la máquina"></textarea>
                                </div>

                                <div className="form-group col-sm-12">
                                    <button type="submit" className="btn btn-primary btn-sm" name="action">Guardar
                                                </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )

        const masInfo = (
            <div className="col-sm-12">
                <div className="card">
                    <div className="card-body">
                        <h5 className="card-title">Acerca de {this.state.equipo.nombre + " " + this.state.equipo.cod_equipo}</h5>
                        <div className="row py-3">
                            <dt className="col-sm-3">Cantidad de mantenimiento</dt>
                            <dd className="col-sm-9">{this.state.equipo.cantMantenimiento}</dd>

                            <dt className="col-sm-3">Cantidad de reparaciones</dt>
                            <dd className="col-sm-9">{this.state.equipo.cantReparacion}</dd>

                            <dt className="col-sm-3">Costo total de mantenimiento</dt>
                            <dd className="col-sm-9">{this.state.equipo.totalCostoMantenimiento}</dd>

                            <dt className="col-sm-3">Costo total de reparaciones</dt>
                            <dd className="col-sm-9">{this.state.equipo.totalCostoReparacion}</dd>

                            <dt className="col-sm-3">Último mantenimiento</dt>
                            <dd className="col-sm-9">{this.state.equipo.ultimoMantenimiento}</dd>

                            <dt className="col-sm-3">Próximo mantenimiento</dt>
                            <dd className="col-sm-9">{this.state.equipo.fechaMantenimiento}</dd>

                            <dt className="col-sm-3">Última reparación</dt>
                            <dd className="col-sm-9">{this.state.equipo.ultimaReparacion}</dd>
                        </div>
                        <div className="row">
                            <div className="col-sm-12">
                                <button className="btn btn-danger btn-sm" onClick={() => this.regresar()}>Regresar</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )

        const visualizar = (
            <div className="col-sm-8">
                <div className="card">
                    <div className="card-body">
                        <h5 className="card-title">Listado de Máquinas</h5>
                        <table className="table table-hover table-dark">
                            <thead>
                                <tr>
                                    <th scope="col">Nombre</th>
                                    <th scope="col">Categoría</th>
                                    <th scope="col">Código</th>
                                    <th scope="col">Costo(Gs.)</th>
                                    <th scope="col">Estado</th>
                                    <th scope="col">Descripción</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    this.state.equipos.map(equipo => {
                                        return (
                                            <tr key={equipo._id}>
                                                <td>{equipo.nombre}</td>
                                                <td>{equipo.categoria.nombre}</td>
                                                <td>{equipo.cod_equipo}</td>
                                                <td>{equipo.costo}</td>
                                                <td>{equipo.estadoCompra}</td>
                                                <td>{equipo.descripcion}</td>
                                                <td>
                                                    {showEdit && <i className="material-icons edit" onClick={() => this.editEquipo(equipo._id)} title="Editar">edit</i>}
                                                    {showDelete &&
                                                        <i className="material-icons delete" onClick={() => this.deleteEquipo(equipo._id)} style={{ margin: '4px' }} title="Eliminar">delete</i>
                                                    }
                                                    {showVisualizacion && <i className="material-icons info" title="Más información" onClick={() => this.mostrarInfo(equipo._id)}>info</i>}
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

        if (isLoading) {
            return (
                <div className="container py-5">
                    <div className="row">
                        {showRegistro && registro}
                        {showVisualizacion && visualizar}
                        {showMasInfo && masInfo}
                    </div>
                    <NotificationContainer />
                </div>
            )
        } else {
            return (
                <Security />
            )
        }

    }
}
