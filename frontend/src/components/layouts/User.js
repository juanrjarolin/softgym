import React from 'react'
import { NavLink } from 'react-router-dom'

export default ({ handleClick }) => {
    return (
        <>
            <li className="active">
                <NavLink to="/">Inicio</NavLink>
            </li>
            <li className="nav-item">
                <NavLink to="#" onClick={handleClick}>Salir</NavLink>
            </li>
        </>
    )
}
