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
        <div className="card-content">
            <span className="card-title white-text">Inicio de sesión</span>
            <form onSubmit={(e) => handleSubmit(e, args)} id="form">
                <div className="row">
                    <div className="input-field col s12" style={{ height: '50px' }}>
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" onChange={handleChange} name="email" className="validate white-text" required autoComplete="off" />
                    </div>
                    <div className="input-field col s12" style={{ height: '50px' }}>
                        <label htmlFor="password">Contraseña</label>
                        <input type="password" id="password" onChange={handleChange} name="password" className="validate white-text" required autoComplete="off" />
                    </div>
                    <div className="input-field col s12">
                        <p>
                            <label>
                                <input type="checkbox" onClick={showPassword} />
                                <span>Mostrar contraseña</span>
                            </label>
                        </p>
                    </div>
                </div>
                <div className="row">
                    <div className="col s12">
                        <button type="submit" className="btn waves-effect waves-light btn-small center-align" name="action">Ingresar</button>
                    </div>
                    <div className="col s12">
                        <Link to="#" style={{ margin: '4px' }}>¿Olvidó su contraseña?</Link>
                    </div>
                </div>
            </form>
        </div>
    )
}
