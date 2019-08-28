import React from 'react'
import { NavLink} from 'react-router-dom'

export default () => {
    return (
        <>
            <li className="nav-item">
                <NavLink to="/signin">Iniciar sesión</NavLink>
            </li>
        </>
    )
}
