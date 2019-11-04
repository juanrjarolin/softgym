const mantenimientoController = {};

const MantenimientoModel = require('../models/Mantenimiento/Mantenimiento');
const EquipoModel = require('../models/Maquina');

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
    var {equipo, detalle, tipoMantenimiento, fechaMantenimiento, costoFijo, costoFinanciero, costoVariable } = req.body;

    let costoTotal;

    if(!equipo){
        return res.json({
            success: false,
            message: 'Debe seleccionar un equipo'
        });
    }

    if(!detalle){
        return res.json({
            success: false,
            message: 'Debe agregar un detalle de mantenimiento'
        });
    }

    if(!fechaMantenimiento){
        return res.json({
            success: false,
            message: 'Debe agregar proporcionar una fecha de mantenimiento'
        });
    }

    const maquina = await EquipoModel.findOne({_id: equipo}); //se trae el equipo

    if(!tipoMantenimiento){
        return res.json({
            success: false,
            message: 'Debe seleccionar el tipo de mantenimiento'
        });
    }else if (tipoMantenimiento === "Preventivo"){
        if(!costoFijo){
            return res.json({
                success: false,
                message: 'Para el mantenimiento preventivo debe proporcionar un costo fijo'
            });
        }else{
            costoTotal = parseInt(costoFijo) + parseInt(costoFinanciero);
            costoVariable = 0;
            maquina.totalCostoMantenimiento = maquina.totalCostoMantenimiento + costoTotal;
            maquina.ultimoMantenimiento = moment(fechaMantenimiento, "DD-MM-YYYY HH:mm:ss").fromNow();
        }
    }else if(tipoMantenimiento === "Correctivo"){
        if(!costoVariable){
            return res.json({
                success: false,
                message: 'Para el mantenimiento correctivo debe proporcionar un costo variable'
            });
        }else{
            costoTotal = parseInt(costoVariable) + parseInt(costoFinanciero);
            if(costoTotal > maquina.costo){
                return res.json({
                    success: false,
                    message: 'El costo de reparación es mayor que el costo del equipo'
                })
            }
            costoFijo = 0;
            maquina.totalCostoReparacion = maquina.totalCostoReparacion + costoTotal;
            maquina.ultimaReparacion = moment(fechaMantenimiento, "DD-MM-YYYY HH:mm:ss").fromNow();
        }
    }

    try {
        const mantenimiento = new MantenimientoModel({
            equipo,
            detalle,
            tipoMantenimiento,
            costoFijo,
            costoFinanciero,
            costoVariable,
            costoTotal,
            fechaMantenimiento
        });
    
        await mantenimiento.save();

        const cantMantenimiento = await MantenimientoModel.find({equipo: equipo}).countDocuments().where('tipoMantenimiento').equals('Preventivo');

        const cantReparacion = await MantenimientoModel.find({equipo: equipo}).countDocuments().where('tipoMantenimiento').equals('Correctivo');
        
        //actualizamos sus propiedades
        maquina.cantMantenimiento = cantMantenimiento;
        maquina.cantReparacion = cantReparacion;
        
        await maquina.save();

        return res.json({
            success: true,
            message: 'Registrado correctamente'
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

mantenimientoController.completedMantenimiento = async(req, res) => {
    try {
        const mantenimiento = await MantenimientoModel.findById(req.params.id);
        mantenimiento.completed = true;
        mantenimiento.estado = "Terminado";
        await mantenimiento.save();
        res.json({
            success: true,
            message: 'Mantenimiento del equipo finalizado'
        });
    } catch (error) {
        res.json({
            success: false,
            message: 'No se pudo finalizar'
        });
    }
}

module.exports = mantenimientoController;