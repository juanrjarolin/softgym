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
            detalles: [],
            detalle: '',
            idMantenimiento: '',
            editMantenimiento: false,
            costo: '',
            _id: '',
            tipoMantenimiento: '',
            dateInicio: new Date(),
            costoReparacion: '',
            showDetalleMantenimiento: false,
            showCabeceraMantenimiento: true,
            showDetalles: false,
            showGuardar: false
        }
        this.handleRegresar = this.handleRegresar.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleChangeDateInicio = dateInicio => this.setState({ dateInicio })

    componentDidMount() {
        const { id } = this.props.match.params
        if (id !== 'nuevo') {
            this.setState({
                idMantenimiento: id,
                editMantenimiento: true
            })
            setTimeout(() => {
                this.fetchRecursos()
            }, 1000)

        } else {
            this.fetchRecursos()
        }
    }

    async fetchRecursos() {
        await Promise.all([this.fetchEquipos(), this.fetchProveedores(), this.handleFetchDetalles()]) //hilo de ejecución en paralelo
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

    handleRegresar() {
        this.setState({
            showDetalleMantenimiento: false,
            showCabeceraMantenimiento: true
        })
    }

    handleSubmitCabecera = async (e) => {
        e.preventDefault()
        try {
            const mantenimiento = {
                proveedor: this.state.proveedor,
                tipoMantenimiento: this.state.tipoMantenimiento,
                fecha: this.state.dateInicio.toLocaleDateString() + ' ' + this.state.dateInicio.toLocaleTimeString()
            }
            if (this.state.editMantenimiento) {
                const res = await axios.put('http://localhost:4000/api/mantenimiento/' + this.state.idMantenimiento, mantenimiento)
                if(res.data.success){
                    this.setState({
                        showDetalleMantenimiento: true,
                        showCabeceraMantenimiento: false,
                        editMantenimiento: false
                    })
                }
            } else {
                const res = await axios.post('http://localhost:4000/api/mantenimiento', mantenimiento)
                if (res.data.success) {
                    this.setState({
                        showDetalleMantenimiento: true,
                        showCabeceraMantenimiento: false,
                        idMantenimiento: res.data.idMantenimiento
                    })
                    this.handleFetchDetalles()
                } else {
                    NotificationManager.error(res.data.message, 'Error')
                }
            }
        } catch (error) {
            NotificationManager.error('Ocurrió un error', 'Error')
        }
    }

    handleSubmitDetalle = async (e) => {
        e.preventDefault()
        const detalle = {
            mantenimiento: this.state.idMantenimiento,
            maquina: this.state.maquina,
            costo: this.state.costo,
            detalle: this.state.detalle
        }

        try {
            if (this.state.editing) {
                const res = await axios.put('http://localhost:4000/api/detalle-mantenimiento/' + this.state._id, detalle)
                if (res.data.success) {
                    NotificationManager.success(res.data.message, 'Actualización')
                    this.setState({
                        costo: '',
                        detalle: '',
                        maquina: '',
                        editing: false,
                        _id: ''
                    })
                    document.getElementById("formDetalle").reset()
                    this.handleFetchDetalles()
                } else {
                    NotificationManager.error(res.data.message, 'Error')
                }
            } else {
                const res = await axios.post('http://localhost:4000/api/detalle-mantenimiento', detalle)
                if (res.data.success) {
                    NotificationManager.success(res.data.message, 'Detalle')
                    this.setState({
                        costo: '',
                        detalle: '',
                        maquina: '',
                        showGuardar: true
                    })
                    document.getElementById("formDetalle").reset()
                    this.handleFetchDetalles()
                } else {
                    NotificationManager.error(res.data.message, 'Detalle')
                }
            }

        } catch (error) {
            NotificationManager.error('Ha ocurrido un error', 'Error')
        }
    }

    async handleFetchDetalles() {
        try {
            const res = await axios.get('http://localhost:4000/api/detalle-mantenimiento/' + this.state.idMantenimiento)
            if (res.data.length > 0) {
                this.setState({
                    detalles: res.data,
                    showGuardar: true
                })
            } else {
                this.setState({
                    detalles: res.data,
                    showGuardar: false
                })
            }
        } catch (error) {

        }
    }


    handleSubmitMantenimiento = async (e) => {
        e.preventDefault()
        try {
            const res = await axios.put('http://localhost:4000/api/mantenimiento/suma-costos/' + this.state.idMantenimiento)
            if (res.data.success) {
                NotificationManager.success(res.data.message, 'Mantenimiento')
                this.setState({
                    maquina: '',
                    detalle: '',
                    proveedor: '',
                    tipoMantenimiento: '',
                    dateInicio: new Date(),
                    costo: '',
                    idMantenimiento: '',
                    editMantenimiento: false
                })
                setTimeout(() => {
                    this.props.history.push(`/mantenimiento`)
                }, 5000)
            }

        } catch (error) {

        }
    }

    async handleDelete(id) {
        try {
            const res = await axios.delete('http://localhost:4000/api/detalle-mantenimiento/' + id)
            if (res.data.success) {
                NotificationManager.success(res.data.message, 'Detalle')
                this.handleFetchDetalles()
            } else {
                NotificationManager.error(res.data.message, 'Detalle')
            }
        } catch (error) {
            NotificationManager.error('Ocurrió un error', 'Error')
        }
    }

    async handleEdit(id) {
        try {
            if (this.state.showCabeceraMantenimiento) {
                this.setState({
                    showDetalleMantenimiento: true,
                    showCabeceraMantenimiento: false
                })
            }
            const res = await axios.get('http://localhost:4000/api/detalle-mantenimiento/detail/' + id)
            this.setState({
                _id: res.data._id,
                maquina: res.data.maquina._id,
                costo: res.data.costo,
                detalle: res.data.detalle,
                editing: true
            })
        } catch (error) {
            NotificationManager.error('Ocurrió un error', 'Error')
        }
    }

    render() {
        const detalleMantenimiento = (
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title">Detalle del Mantenimiento</h5>
                    <form onSubmit={this.handleSubmitDetalle} id="formDetalle">
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
                                <input type="number" name="costo" id="costo" className="form-control form-control-sm" placeholder="Ingrese un costo" required autoComplete="off" title="Costo de mano de obra,de piezas cambiadas, etc." onChange={this.handleChange} value={this.state.costo} />
                            </div>
                            <div className="form-group col-sm-8">
                                <label htmlFor="detalle">Detalles del mantenimiento</label>
                                <textarea className="form-control form-control-sm validate" name="detalle" id="detalle" onChange={this.handleChange} value={this.state.detalle} placeholder="Ingrese los detalles de mantenimiento de la máquina"></textarea>
                            </div>
                            <div className="form-group col-sm-12">
                                <button className="btn btn-primary btn-sm" onClick={this.handleRegresar}>Regresar</button>
                                <button type="submit" style={{ margin: '4px' }} className="btn btn-primary btn-sm">Agregar</button>
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
                                            this.state.detalles.map(detal => {
                                                return (
                                                    <tr key={detal._id}>
                                                        <td>{detal.maquina.nombre}</td>
                                                        <td>{detal.costo}</td>
                                                        <td>{detal.detalle}</td>
                                                        <td>
                                                            <button type="button" className="btn btn-success btn-sm">
                                                                <i className="material-icons" onClick={() => this.handleEdit(detal._id)}>
                                                                    edit
                                                                </i>
                                                            </button>
                                                            <button className="btn btn-danger btn-sm" style={{ margin: '4px' }}>
                                                                <i className="material-icons" onClick={() => this.handleDelete(detal._id)}>
                                                                    delete
                                                                </i>
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
                        <div className="row">
                            {this.state.showGuardar && <div className="col-sm-12">
                                <button type="submit" className="btn btn-primary btn-sm">Aceptar</button>
                            </div>}
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
                        {muestraDetalles}
                    </div>
                </div>
                <NotificationContainer />
            </div>
        )
    }
}
