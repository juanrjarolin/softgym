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
        <div className="card-body animated bounceInDown">
            <h5 className="card-title">Cambio de Contraseña</h5>
            <form onSubmit={(e) => handleSubmit(e, args)} id="form">
                <div className="row">
                    <div className="form-group col-sm-11">
                        <label htmlFor="password1">Nueva contraseña</label>
                        <input type="password" id="password1" minLength="8" maxLength="15" onChange={handleChange} name="password1" className="form-control form-control-sm validate" required autoComplete="off" placeholder="Ingrese nueva contraseña"/>
                    </div>
                    <div className="form-group col-sm-11">
                        <label htmlFor="password2">Confirmación de contraseña</label>
                        <input type="password" id="password2" minLength="8" maxLength="15" onChange={handleChange} name="password2" className="form-control form-control-sm" required autoComplete="off" placeholder="Repita la contraseña"/>
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
                        <button type="submit" className="btn btn-primary btn-sm" name="action">Guardar</button>
                    </div>
                </div>
            </form>
        </div>
    )
}
