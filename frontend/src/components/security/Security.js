import React, { Component } from 'react'
import Modal from 'react-modal';
import { withRouter } from 'react-router-dom'

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)'
    }
};

Modal.setAppElement('#root')

class Security extends Component {
    constructor() {
        super()
        this.state = {
            modalIsOpen: false
        }
        this.closeModal = this.closeModal.bind(this);
    }

    componentDidMount(){
        this.setState({ modalIsOpen: true });
    }

    closeModal() {
        this.setState({ modalIsOpen: false });
        this.props.history.push(`/`)
    }

    render() {
        return (
            <div>
                <Modal
                    isOpen={this.state.modalIsOpen}
                    onRequestClose={this.closeModal}
                    style={customStyles}
                    contentLabel="Example Modal"
                >

                    <h2 ref={subtitle => this.subtitle = subtitle}>Acceso denegado</h2>
                    <p>Es posible que deba iniciar sesión o tener los permisos suficientes.</p>
                    <button className="btn btn-primary" onClick={this.closeModal}>Cerrar</button>
                </Modal>
            </div>
        )
    }
}

export default withRouter(Security)