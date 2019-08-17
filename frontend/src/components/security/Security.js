import React, { Component } from 'react'
import M from "materialize-css"
import { Link } from 'react-router-dom'
import "materialize-css/dist/css/materialize.min.css"

export default class Security extends Component {
    componentDidMount() {
        M.Modal.init(this.Modal)
        let instance = M.Modal.getInstance(this.Modal)
        instance.open()
    }
    render() {
        return (
            <>
                <div className="section container">
                    <div className="row">
                        <div className="col s4"></div>
                        <div className="col s4">
                            <div ref={Modal => { this.Modal = Modal; }} id="modal1" className="modal">
                                <div className="modal-content">
                                    <h4>Contenido no disponible</h4>
                                    <p>Por favor, inicia sesión</p>
                                </div>
                                <div className="modal-footer">
                                    <Link to="/" className="modal-close waves-effect waves-green btn-flat">Salir</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}
