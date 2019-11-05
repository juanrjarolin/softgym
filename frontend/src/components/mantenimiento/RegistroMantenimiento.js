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
            detalles: '',
            costoMantenimiento: '',
            tipoMantenimiento: '',
            dateInicio: new Date(),
            costoReparacion: '',
            showDetalleMantenimiento: false
        }
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleChangeDateInicio = dateInicio => this.setState({ dateInicio })

    componentDidMount() {
        this.fetchEquipos()
        this.fetchProveedores()
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

    async fetchProveedores(){
        try {
            const res = await axios.get('http://localhost:4000/api/personas/proveedores')
        } catch (error) {
            
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

    handleSubmitCabecera = (e) => {
        e.preventDefault()
        console.log(this.state.proveedor);
        console.log(this.state.dateInicio);
        console.log(this.state.tipoMantenimiento);
    }

    render() {
        const { showDetalleMantenimiento, showRegistroCorrectivo } = this.state
        const preventivo = (
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title">Mantenimiento Preventivo</h5>
                    <form id="formPreventivo" onSubmit={this.handleSubmit}>
                        <div className="row">
                            <div className="form-group col-sm-12">
                                <label htmlFor="costoFijo">Costo Fijo</label>
                                <input type="number" name="costoFijo" id="costoFijo" className="form-control form-control-sm" placeholder="Ingrese un costo fijo" required autoComplete="off" title="Costo de mano de obra,de piezas cambiadas, etc." onChange={this.handleChange} />
                            </div>
                            <div className="form-group col-sm-12">
                                <label htmlFor="costoFinanciero">Costo Financiero</label>
                                <input type="number" name="costoFinanciero" id="costoFinanciero" className="form-control form-control-sm" placeholder="Ingrese un costo financiero" required autoComplete="off" title="Si hubo un reemplazo para mantener la disponibilidad del servicio" onChange={this.handleChange} />
                            </div>
                            <div className="form-group col-sm-12">
                                <label htmlFor="detalles">Detalles del mantenimiento</label>
                                <textarea className="form-control form-control-sm validate" name="detalles" id="detalles" onChange={this.handleChange} value={this.state.detalles} placeholder="Ingrese los detalles del mantenimiento de la máquina" required></textarea>
                            </div>
                            <div className="form-group col-sm-12">
                                <label htmlFor="fechaInicio">Fecha de mantenimiento</label>
                                <DateTimePicker className="form-control form-control-sm" value={this.state.dateInicio} id="fechaInicio" onChange={this.handleChangeDateInicio} />
                            </div>
                            <div className="form-group col-sm-12">
                                <button type="submit" className="btn btn-primary btn-sm">Guardar</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        )

        const registroCorrectivo = (
            <form onSubmit={this.handleSubmit}>
                <div className="row">
                    <div className="form-group col-sm-12">
                        <label htmlFor="costoVariable">Costo Variable</label>
                        <input type="number" name="costoVariable" id="costoVariable" className="form-control form-control-sm" placeholder="Ingrese un costo variable" required autoComplete="off" title="Costo de mano de obra,de piezas cambiadas, etc." onChange={this.handleChange} />
                    </div>
                    <div className="form-group col-sm-12">
                        <label htmlFor="costoFinanciero">Costo Financiero</label>
                        <input type="number" name="costoFinanciero" id="costoFinanciero" className="form-control form-control-sm" placeholder="Ingrese un costo financiero" required autoComplete="off" title="Si hubo un reemplazo para mantener la disponibilidad del servicio" onChange={this.handleChange} />
                    </div>
                    <div className="form-group col-sm-12">
                        <label htmlFor="detalles">Detalles de la reparación</label>
                        <textarea className="form-control form-control-sm validate" name="detalles" id="detalles" onChange={this.handleChange} value={this.state.detalles} placeholder="Ingrese los detalles de reparación de la máquina" required></textarea>
                    </div>
                    <div className="form-group col-sm-12">
                        <label htmlFor="fechaInicio">Fecha de reparación</label>
                        <DateTimePicker className="form-control form-control-sm" value={this.state.dateInicio} id="fechaInicio" onChange={this.handleChangeDateInicio} />
                    </div>
                    <div className="form-group col-sm-12">
                        <button type="submit" className="btn btn-primary btn-sm">Guardar</button>
                    </div>
                </div>
            </form>
        )

        const correctivo = (
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title">Mantenimiento Correctivo</h5>
                    {showRegistroCorrectivo && registroCorrectivo}
                </div>
            </div>
        )

        const detalleMantenimiento = (
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title">Detalle del Mantenimiento</h5>
                    <form>
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
                        </div>
                    </form>
                </div>
            </div>
        )

        return (
            <div className="container py-5">
                <div className="row">
                    <div className="col-sm-5">
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
                                                            <option key={proveedor._id} value={proveedor._id}>{proveedor.nombre}</option>
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
                    </div>
                    <div className="col-sm-7">
                        {showDetalleMantenimiento && detalleMantenimiento}
                    </div>
                </div>
                <NotificationContainer />
            </div>
        )
    }
}
