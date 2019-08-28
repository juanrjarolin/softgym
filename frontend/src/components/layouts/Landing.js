import React, { Component } from 'react'
import M from 'materialize-css/dist/js/materialize.min.js'

export default class Landing extends Component {

    componentDidMount(){
        var elems = document.querySelectorAll('.slider');
        M.Slider.init(elems, {duration: 500});
    }

    render() {

        return (
            <div className="section container animated fadeInDown">
                <div className="row"></div>
                <div className="row">
                    <div className="slider">
                        <ul className="slides">
                            <li>
                                <img src={process.env.PUBLIC_URL + '/img/imagen.jpg'} alt=""/>
                                <div className="caption center-align">
                                    <h3>Esfuérzate por progresar</h3>
                                    <h5 className="light grey-text text-lighten-3">No por llegar a la perfección</h5>
                                </div>
                            </li>
                            <li>
                                <img src={process.env.PUBLIC_URL + '/img/imagen2.jpg'} alt=""/>
                                <div className="caption left-align">
                                    <h3>Todos los grandes logros</h3>
                                    <h5 className="light grey-text text-lighten-3">Requieren tiempo</h5>
                                </div>
                            </li>
                            <li>
                                <img src={process.env.PUBLIC_URL + '/img/imagen3.jpg'} alt=""/>
                                <div className="caption right-align">
                                    <h3>Los logros no son magia</h3>
                                    <h5 className="light grey-text text-lighten-3">Son trabajo duro y dedicación</h5>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        )
    }
}
