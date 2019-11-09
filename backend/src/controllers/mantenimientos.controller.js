const mantenimientoController = {};

const MantenimientoModel = require('../models/Mantenimiento/Mantenimiento');
const DetalleMantenimiento = require('../models/Mantenimiento/DetalleMantenimiento');

const moment = require('moment');
moment.locale('es');

mantenimientoController.getMantenimientos = async(req, res) => {
    const mantenimientos = await MantenimientoModel.find();
    res.json(mantenimientos);
};

mantenimientoController.getMantenimiento = async(req, res) => {
    const mantenimiento = await MantenimientoModel.findById(req.params.id);
    res.json(mantenimiento);
};

mantenimientoController.createMantenimiento = async(req, res) => {
    var {tipoMantenimiento, fecha, proveedor } = req.body;

    if(!fecha){
        return res.json({
            success: false,
            message: 'Debe agregar proporcionar una fecha de mantenimiento'
        });
    }

    //const maquina = await EquipoModel.findOne({_id: equipo}); //se trae el equipo

    if(!tipoMantenimiento){
        return res.json({
            success: false,
            message: 'Debe seleccionar el tipo de mantenimiento'
        });
    }

    if(!proveedor){
        return res.json({
            success: false,
            message: 'Debe seleccionar un proveedor'
        });
    }


    try {
        const mantenimiento = new MantenimientoModel({
            proveedor,
            fecha,
            tipoMantenimiento
        });
    
        mantenimiento.save((err, mant) => {
            if(!err){
                res.json({
                    success: true,
                    idMantenimiento: mant._id
                });
            }
        });

    } catch (error) {
        return res.json({
            success: false,
            message: 'Ocurrió un error'
        });
    }
};

mantenimientoController.updateMantenimiento = async(req, res) => {
    try {
        await MantenimientoModel.findByIdAndUpdate({_id: req.params.id}, req.body);
        res.json({
            success: true,
            message: 'Mantenimiento actualizado'
        });
    } catch (error) {
        res.json({
            success: false,
            message: 'No se pudo actualizar'
        });
    }
};

mantenimientoController.deleteMantenimiento = async(req, res) => {
    try {
        await MantenimientoModel.findByIdAndDelete(req.params.id);
        await DetalleMantenimiento.deleteMany().where('mantenimiento').equals(req.params.id)
        res.json({
            success: true,
            message: 'Se ha eliminado el mantenimiento'
        });
    } catch (error) {
        res.json({
            success: false,
            message: 'No se pudo eliminar'
        });
    }
};

mantenimientoController.updateSumaCostos = async(req, res) => {
    try {
        let costoTotal = 0;
        const detalles = await DetalleMantenimiento.find().where('mantenimiento').equals(req.params.id);
        detalles.forEach((detalle) => {
            costoTotal = costoTotal + detalle.costo;
        });
        const mantenimiento = await MantenimientoModel.findOne({_id: req.params.id});
        mantenimiento.costoTotal = costoTotal;
        await mantenimiento.save();

        res.json({
            success: true,
            message: 'Mantenimiento registrado'
        });
    } catch (error) {
        
    }
}



module.exports = mantenimientoController;