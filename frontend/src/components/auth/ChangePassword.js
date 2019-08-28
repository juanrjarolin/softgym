import React from 'react'

export default ({handleSubmit}) => {
    const args = {}

    const handleChange = (e) => {
        args[e.target.name] = e.target.value
    }

    const showPassword = () => {
        var x1 = document.getElementById("password1")
        var x2 = document.getElementById("password2")

        if(x1.type === "password" && x2.type === "password"){
            x1.type = "text"
            x2.type = "text"
        }else{
            x1.type = "password"
            x2.type = "password"
        }
    }

    return (
        <div className="card-content animated bounceInDown">
            <span className="card-title white-text">Cambio de Contraseña</span>
            <form onSubmit={(e) => handleSubmit(e, args)} id="form">
                <div className="row">
                    <div className="input-field col s12" style={{ height: '50px' }}>
                        <label htmlFor="password1">Nueva contraseña</label>
                        <input type="password" id="password1" minLength="8" maxLength="15" onChange={handleChange} name="password1" className="validate white-text" required autoComplete="off" />
                        <span className="helper-text" data-error="Incorrecto" data-success="Correcto"></span>
                    </div>
                    <div className="input-field col s12" style={{ height: '50px' }}>
                        <label htmlFor="password2">Confirmación de contraseña</label>
                        <input type="password" id="password2" minLength="8" maxLength="15" onChange={handleChange} name="password2" className="validate white-text" required autoComplete="off" />
                        <span className="helper-text" data-error="Incorrecto" data-success="Correcto"></span>
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
                        <button type="submit" className="btn waves-effect waves-light btn-small center-align" name="action">Guardar</button>
                    </div>
                </div>
            </form>
        </div>
    )
}
