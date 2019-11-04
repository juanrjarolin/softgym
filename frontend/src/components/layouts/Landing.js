import React, { Component } from 'react'

export default class Landing extends Component {

    componentDidMount() {
        /*
        var elems = document.querySelectorAll('.slider');
        M.Slider.init(elems, {duration: 500});*/
    }

    render() {

        return (
            <div id="carouselExampleIndicators" className="carousel slide p-5" data-ride="carousel">
                <ol className="carousel-indicators">
                    <li data-target="#carouselExampleIndicators" data-slide-to="0" className="active"></li>
                    <li data-target="#carouselExampleIndicators" data-slide-to="1"></li>
                    <li data-target="#carouselExampleIndicators" data-slide-to="2"></li>
                </ol>
                <div className="carousel-inner">
                    <div className="carousel-item active">
                        <img src={process.env.PUBLIC_URL + '/img/imagen.jpg'} className="rounded mx-auto d-block w-50" alt="" />
                        <div className="carousel-caption d-none d-md-block animated fadeInDown">
                            <h5>Esfuérzate por progresar</h5>
                            <p>No por llegar a la perfección</p>
                        </div>
                    </div>
                    <div className="carousel-item">
                        <img src={process.env.PUBLIC_URL + '/img/imagen2.jpg'} className="rounded mx-auto d-block w-50" alt="" />
                        <div className="carousel-caption d-none d-md-block animated fadeInRight">
                            <h5>Todos los grandes logros</h5>
                            <p>Requieren tiempo</p>
                        </div>
                    </div>
                    <div className="carousel-item">
                        <img src={process.env.PUBLIC_URL + '/img/imagen3.jpg'} className="rounded mx-auto d-block w-50" alt="" />
                        <div className="carousel-caption d-none d-md-block animated fadeInLeft">
                            <h5>Los logros no son magia</h5>
                            <p>Son trabajo duro y dedicación</p>
                        </div>
                    </div>
                </div>
                <a className="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev">
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="sr-only">Previous</span>
                </a>
                <a className="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="sr-only">Next</span>
                </a>
            </div>
        )
    }
}
