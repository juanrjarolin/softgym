import React from 'react'

export default ({handleSubmitCust, permisos}) => {

    const args = {}
    const list = []
    let editing
    if(permisos.success === false){
        editing = false
    }else{
        editing = true        
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        for(let i=0; i<e.target.length; i++){
            if(e.target[i].checked){
                args[e.target[i].name] = true
            }
        }
        list.push(args)
        list.push(editing)
        handleSubmitCust(e, list)
    }

    return (
        <div className="card">
            <div className="card-body">
                <h5 className="card-title">Gestión de permisos</h5>
                <form onSubmit={handleSubmit}>
                    <div className="form-group col-sm-12">
                        <table className="table table-hover table-dark">
                            <thead>
                                <tr>
                                    <th scope="col">Recurso</th>
                                    <th scope="col">Visualizar</th>
                                    <th scope="col">Crear</th>
                                    <th scope="col">Editar</th>
                                    <th scope="col">Eliminar</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <th scope="row">Gestión de usuarios</th>
                                    <td>
                                        <div className="form-check">
                                            <input className="form-check-input" type="checkbox" name="visualizarUsuario" defaultChecked={permisos.visualizarUsuario ? true : false}/>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="form-check">
                                            <input className="form-check-input" type="checkbox" name="crearUsuario" defaultChecked={permisos.crearUsuario ? true : false}/>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="form-check">
                                            <input className="form-check-input" type="checkbox" name="editarUsuario" defaultChecked={permisos.editarUsuario ? true : false}/>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="form-check">
                                            <input className="form-check-input" type="checkbox" name="eliminarUsuario" defaultChecked={permisos.eliminarUsuario ? true : false}/>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row">Gestión de roles</th>
                                    <td>
                                        <div className="form-check">
                                            <input className="form-check-input" type="checkbox" name="visualizarRol" defaultChecked={permisos.visualizarRol ? true : false}/>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="form-check">
                                            <input className="form-check-input" type="checkbox" name="crearRol" defaultChecked={permisos.crearRol ? true : false}/>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="form-check">
                                            <input className="form-check-input" type="checkbox" name="editarRol" defaultChecked={permisos.editarRol ? true : false}/>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="form-check">
                                            <input className="form-check-input" type="checkbox" name="eliminarRol" defaultChecked={permisos.eliminarRol ? true : false}/>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row">Gestión de permisos (Admin)</th>
                                    <td>
                                        <div className="form-check">
                                            <input className="form-check-input" type="checkbox" name="visualizarPermiso" defaultChecked={permisos.visualizarPermiso ? true : false}/>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row">Gestión de clientes</th>
                                    <td>
                                        <div className="form-check">
                                            <input className="form-check-input" type="checkbox" name="visualizarCliente" defaultChecked={permisos.visualizarCliente ? true : false}/>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="form-check">
                                            <input className="form-check-input" type="checkbox" name="crearCliente" defaultChecked={permisos.crearCliente ? true : false}/>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="form-check">
                                            <input className="form-check-input" type="checkbox" name="editarCliente" defaultChecked={permisos.editarCliente ? true : false}/>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="form-check">
                                            <input className="form-check-input" type="checkbox" name="eliminarCliente" defaultChecked={permisos.eliminarCliente ? true : false}/>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row">Gestión de proveedores</th>
                                    <td>
                                        <div className="form-check">
                                            <input className="form-check-input" type="checkbox" name="visualizarProveedor" defaultChecked={permisos.visualizarProveedor ? true : false}/>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="form-check">
                                            <input className="form-check-input" type="checkbox" name="crearProveedor" defaultChecked={permisos.crearProveedor ? true : false}/>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="form-check">
                                            <input className="form-check-input" type="checkbox" name="editarProveedor" defaultChecked={permisos.editarProveedor? true : false}/>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="form-check">
                                            <input className="form-check-input" type="checkbox" name="eliminarProveedor" defaultChecked={permisos.eliminarProveedor ? true : false}/>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row">Gestión de clases</th>
                                    <td>
                                        <div className="form-check">
                                            <input className="form-check-input" type="checkbox" name="visualizarClase" defaultChecked={permisos.visualizarClase ? true : false}/>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="form-check">
                                            <input className="form-check-input" type="checkbox" name="crearClase" defaultChecked={permisos.crearClase ? true : false}/>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="form-check">
                                            <input className="form-check-input" type="checkbox" name="editarClase" defaultChecked={permisos.editarClase ? true : false}/>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="form-check">
                                            <input className="form-check-input" type="checkbox" name="eliminarClase" defaultChecked={permisos.eliminarClase ? true : false}/>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row">Gestión de reservas</th>
                                    <td>
                                        <div className="form-check">
                                            <input className="form-check-input" type="checkbox" name="visualizarReserva" defaultChecked={permisos.visualizarReserva ? true : false}/>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="form-check">
                                            <input className="form-check-input" type="checkbox" name="crearReserva" defaultChecked={permisos.crearReserva ? true : false}/>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="form-check">
                                            <input className="form-check-input" type="checkbox" name="editarReserva" defaultChecked={permisos.editarReserva ? true : false}/>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="form-check">
                                            <input className="form-check-input" type="checkbox" name="eliminarReserva" defaultChecked={permisos.eliminarReserva ? true : false}/>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row">Gestión de máquinas</th>
                                    <td>
                                        <div className="form-check">
                                            <input className="form-check-input" type="checkbox" name="visualizarMaquina" defaultChecked={permisos.visualizarMaquina ? true : false}/>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="form-check">
                                            <input className="form-check-input" type="checkbox" name="crearMaquina" defaultChecked={permisos.crearMaquina ? true : false}/>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="form-check">
                                            <input className="form-check-input" type="checkbox" name="editarMaquina" defaultChecked={permisos.editarMaquina ? true : false}/>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="form-check">
                                            <input className="form-check-input" type="checkbox" name="eliminarMaquina" defaultChecked={permisos.eliminarMaquina ? true : false}/>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row">Gestión de mantenimientos</th>
                                    <td>
                                        <div className="form-check">
                                            <input className="form-check-input" type="checkbox" name="visualizarMantenimiento" defaultChecked={permisos.visualizarMantenimiento ? true : false}/>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="form-check">
                                            <input className="form-check-input" type="checkbox" name="crearMantenimiento" defaultChecked={permisos.crearMantenimiento ? true : false}/>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="form-check">
                                            <input className="form-check-input" type="checkbox" name="editarMantenimiento" defaultChecked={permisos.editarMantenimiento ? true : false}/>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="form-check">
                                            <input className="form-check-input" type="checkbox" name="eliminarMantenimiento" defaultChecked={permisos.eliminarMantenimiento ? true : false}/>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row">Gestión de productos</th>
                                    <td>
                                        <div className="form-check">
                                            <input className="form-check-input" type="checkbox" name="visualizarProducto" defaultChecked={permisos.visualizarProducto ? true : false}/>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="form-check">
                                            <input className="form-check-input" type="checkbox" name="crearProducto" defaultChecked={permisos.crearProducto ? true : false}/>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="form-check">
                                            <input className="form-check-input" type="checkbox" name="editarProducto" defaultChecked={permisos.editarProducto ? true : false}/>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="form-check">
                                            <input className="form-check-input" type="checkbox" name="eliminarProducto" defaultChecked={permisos.eliminarProducto ? true : false}/>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="form-group col-sm-12">
                        <button type="submit" className="btn btn-primary btn-sm">Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    )
}