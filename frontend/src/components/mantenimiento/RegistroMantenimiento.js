import React, { Component } from 'react'
import { NotificationContainer, NotificationManager } from 'react-notifications'
import DateTimePicker from 'react-datetime-picker'
import axios from 'axios'

export default class RegistroMantenimiento extends Component {
    constructor() {
        super()
        this.state = {
            equipos: [],
            proveedores: [],
            proveedor: '',
            maquina: '',
            maquinas: [],
            detalle: '',
            costo: '',
            tipoMantenimiento: '',
            dateInicio: new Date(),
            costoReparacion: '',
            showDetalleMantenimiento: false,
            showCabeceraMantenimiento: true,
            showDetalles: false
        }
        this.handleRegresar = this.handleRegresar.bind(this);
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleChangeDateInicio = dateInicio => this.setState({ dateInicio })

    componentDidMount() {
        this.fetchRecursos()
    }

    async fetchRecursos() {
        await Promise.all([this.fetchEquipos(), this.fetchProveedores()]) //hilo de ejecución en paralelo
    }

    async fetchEquipos() {
        try {
            const equipos = await axios.get('http://localhost:4000/api/equipos')
            this.setState({
                equipos: equipos.data
            })
        } catch (error) {
            NotificationManager.error('No se pudo obtener equipos', 'Error')
        }
    }

    async fetchProveedores() {
        try {
            const res = await axios.get('http://localhost:4000/api/personas/proveedores')
            this.setState({
                proveedores: res.data
            })
        } catch (error) {
            NotificationManager.error('Ocurrió un error al recuperar proveedores', 'Error')
        }
    }

    handleRadio = (e) => {
        if (e.target.value === "Preventivo") {
            this.setState({
                tipoMantenimiento: e.target.value
            })
        } else {
            this.setState({
                tipoMantenimiento: e.target.value
            })
        }
    }

    handleSubmit = async (e) => {
        e.preventDefault()
        let mantenimiento
        //console.log(this.state.dateInicio.toLocaleDateString() + ' ' + this.state.dateInicio.toLocaleTimeString())
        if (this.state.tipoMantenimiento === 'Preventivo') {
            mantenimiento = {
                equipo: this.state.maquina,
                tipoMantenimiento: this.state.tipoMantenimiento,
                fechaMantenimiento: this.state.dateInicio.toLocaleDateString() + ' ' + this.state.dateInicio.toLocaleTimeString(),
                costoFijo: this.state.costoFijo,
                costoFinanciero: this.state.costoFinanciero,
                detalle: this.state.detalles
            }
        } else {
            mantenimiento = {
                equipo: this.state.maquina,
                tipoMantenimiento: this.state.tipoMantenimiento,
                fechaMantenimiento: this.state.dateInicio.toLocaleDateString() + ' ' + this.state.dateInicio.toLocaleTimeString(),
                costoVariable: this.state.costoVariable,
                costoFinanciero: this.state.costoFinanciero,
                detalle: this.state.detalles
            }
        }

        try {
            const result = await axios.post('http://localhost:4000/api/mantenimiento', mantenimiento)
            if (result.data.success) {
                //si ok entonces muestra el mensaje y luego de 5 segundos se redirige al listado de mantenimientos
                NotificationManager.success(result.data.message, 'Mantenimiento')
                this.setState({
                    maquina: '',
                    detalles: '',
                    costoFijo: '',
                    costoFinanciero: '',
                    costoVariable: '',
                    dateInicio: ''
                })
                setTimeout(() => {
                    this.props.history.push(`/mantenimiento`)
                }, 5000)
            } else {
                NotificationManager.error(result.data.message, 'Mantenimiento')
            }
        } catch (error) {
            NotificationManager.error('No se pudo registrar el mantenimiento', 'Error')
        }
    }

    handleRegresar() {
        this.setState({
            showDetalleMantenimiento: false,
            showCabeceraMantenimiento: true
        })
    }

    handleSubmitCabecera = (e) => {
        e.preventDefault()
        if (!this.state.proveedor) {
            NotificationManager.warning('Seleccione proveedor', 'Advertencia')
            return
        }
        if (!this.state.dateInicio) {
            NotificationManager.warning('Seleccione una fecha de mantenimiento', 'Advertencia')
            return
        }
        if (!this.state.tipoMantenimiento) {
            NotificationManager.warning('Seleccione un tipo de mantenimiento', 'Advertencia')
            return
        }

        this.setState({
            showDetalleMantenimiento: true,
            showCabeceraMantenimiento: false
        })
    }

    handleSubmitDetalle = async (e) => {
        e.preventDefault()
        try {
            const res = await axios.get('http://localhost:4000/api/equipos/' + this.state.maquina)
            const detalle = {
                id: this.state.maquina,
                nombre: res.data.nombre,
                costo: this.state.costo,
                detalle: this.state.detalle
            }
            this.state.maquinas.push(detalle)
            this.setState({
                showDetalles: true
            })
        } catch (error) {
            NotificationManager.error('Ha ocurrido un error', 'Error')
        }
    }

    handleSubmitMantenimiento = (e) => {
        e.preventDefault()
        
    }

    render() {

        const detalleMantenimiento = (
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title">Detalle del Mantenimiento</h5>
                    <form onSubmit={this.handleSubmitDetalle}>
                        <div className="row">
                            <div className="form-group col-sm-8">
                                <label htmlFor="equipos">Equipo</label>
                                <select className="form-control form-control-sm" name="maquina" id="equipos" onChange={this.handleChange} required>
                                    <option defaultValue>Seleccione máquina</option>
                                    {
                                        this.state.equipos.map(equipo => {
                                            return (
                                                <option key={equipo._id} value={equipo._id}>{equipo.nombre}</option>
                                            )
                                        })
                                    }
                                </select>
                            </div>
                            <div className="form-group col-sm-8">
                                <label htmlFor="costo">Costo de mantenimiento</label>
                                <input type="number" name="costo" id="costo" className="form-control form-control-sm" placeholder="Ingrese un costo" required autoComplete="off" title="Costo de mano de obra,de piezas cambiadas, etc." onChange={this.handleChange} />
                            </div>
                            <div className="form-group col-sm-8">
                                <label htmlFor="detalle">Detalles del mantenimiento</label>
                                <textarea className="form-control form-control-sm validate" name="detalle" id="detalle" onChange={this.handleChange} value={this.state.detalles} placeholder="Ingrese los detalles de mantenimiento de la máquina"></textarea>
                            </div>
                            <div className="form-group col-sm-5">
                                <button className="btn btn-primary btn-sm" onClick={this.handleRegresar}>Regresar</button>
                            </div>
                            <div className="form-group col-sm-6">
                                <button type="submit" className="btn btn-primary btn-sm">Agregar</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        )

        const cabeceraMantenimiento = (
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title">Registro de Mantenimiento</h5>
                    <form onSubmit={this.handleSubmitCabecera}>
                        <div className="row">
                            <div className="form-group col-sm-8">
                                <label htmlFor="proveedor">Proveedor</label>
                                <select className="form-control form-control-sm" name="proveedor" id="proveedor" onChange={this.handleChange} required>
                                    <option defaultValue>Seleccione proveedor</option>
                                    {
                                        this.state.proveedores.map(proveedor => {
                                            return (
                                                <option key={proveedor._id} value={proveedor._id}>{proveedor.nombre + ' ' + proveedor.apellido}</option>
                                            )
                                        })
                                    }
                                </select>
                            </div>
                            <div className="form-group col-sm-8">
                                <label htmlFor="fechaInicio">Fecha</label>
                                <DateTimePicker className="form-control form-control-sm" value={this.state.dateInicio} id="fechaInicio" onChange={this.handleChangeDateInicio} />
                            </div>
                            <div className="form-group col-sm-12">
                                <div className="form-check">
                                    <input className="form-check-input" type="radio" name="tipo" id="preventivo" value="Preventivo" onChange={this.handleRadio} />
                                    <label className="form-check-label" htmlFor="preventivo">
                                        Preventivo
                                            </label>
                                </div>
                                <div className="form-check">
                                    <input className="form-check-input" type="radio" name="tipo" id="correctivo" value="Correctivo" onChange={this.handleRadio} />
                                    <label className="form-check-label" htmlFor="correctivo">
                                        Correctivo
                                            </label>
                                </div>
                            </div>
                            <div className="form-group col-sm-12">
                                <button type="submit" className="btn btn-primary btn-sm">Siguiente</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        )

        const muestraDetalles = (
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title">Listado de máquinas</h5>
                    <form onSubmit={this.handleSubmitMantenimiento}>
                        <div className="row">
                            <div className="col-sm-12">
                                <table className="table table-hover table-dark">
                                    <thead>
                                        <tr>
                                            <th scope="col">Maquina</th>
                                            <th scope="col">Costo</th>
                                            <th scope="col">Detalle</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            this.state.maquinas.map(maquina => {
                                                return (
                                                    <tr key={maquina.id}>
                                                        <td>{maquina.nombre}</td>
                                                        <td>{maquina.costo}</td>
                                                        <td>{maquina.detalle}</td>
                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-sm-12">
                                <button type="submit" className="btn btn-primary btn-sm">Guardar</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        )

        return (
            <div className="container py-5">
                <div className="row">
                    <div className="col-sm-5">
                        {this.state.showDetalleMantenimiento && detalleMantenimiento}
                        {this.state.showCabeceraMantenimiento && cabeceraMantenimiento}
                    </div>
                    <div className="col-sm-7">
                        {this.state.showDetalles && muestraDetalles}
                    </div>
                </div>
                <NotificationContainer />
            </div>
        )
    }
}
