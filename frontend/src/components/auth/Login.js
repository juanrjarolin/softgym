import React from 'react'
import { Link } from 'react-router-dom';

export default ({handleSubmit}) => {

    const args = {}

    const handleChange = (e) => {
        args[e.target.name] = e.target.value
    }

    const showPassword = () => {
        var x = document.getElementById("password")
        if(x.type === "password"){
            x.type = "text"
        }else{
            x.type = "password"
        }
    }

    return (
        <div className="card-body">
            <h5 className="card-title">Inicio de sesión</h5>
            <form onSubmit={(e) => handleSubmit(e, args)} id="form">
                <div className="row">
                    <div className="form-group col-sm-11">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" onChange={handleChange} name="email" className="form-control form-control-sm validate" required autoComplete="off" placeholder="Ingrese su correo electrónico"/>
                    </div>
                    <div className="form-group col-sm-11">
                        <label htmlFor="password">Contraseña</label>
                        <input type="password" id="password" onChange={handleChange} name="password" className="form-control form-control-sm validate" required autoComplete="off" placeholder="Ingrese su contraseña"/>
                    </div>
                    <div className="form-check col-sm-11">
                        <p>
                            <label>
                                <input type="checkbox" onClick={showPassword}/>
                                <span className="px-2">Mostrar contraseña</span>
                            </label>
                        </p>
                    </div>
                    <div className="form-group col-sm-11">
                        <button type="submit" className="btn btn-primary btn-sm" name="action">Ingresar</button>
                    </div>
                    <div className="form-group col-sm-12">
                        <p className="card-text">¿Olvidó su contraseña? <Link to="/recuperacion-password">Recuperar</Link></p>
                    </div>
                </div>
            </form>
        </div>
    )
}
