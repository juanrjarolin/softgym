const mantenimientoController = {};

const MantenimientoModel = require('../models/Mantenimiento');

mantenimientoController.getMantenimientos = async(req, res) => {
    const mantenimientos = await MantenimientoModel.find();
    res.json(mantenimientos);
};

mantenimientoController.getMantenimiento = async(req, res) => {
    const mantenimiento = await MantenimientoModel.findById(req.params.id);
    res.json(mantenimiento);
};

mantenimientoController.createMantenimiento = async(req, res) => {
    const {equipo, detalleMantenimiento} = req.body;
    if(!equipo){
        return res.json({
            success: false,
            message: 'Debe seleccionar un equipo'
        });
    }

    if(!detalleMantenimiento){
        return res.json({
            success: false,
            message: 'Debe agregar un detalle de mantenimiento'
        });
    }

    try {
        const result = await MantenimientoModel.find({equipo: equipo})
            .where('completed').equals(false);
        
        if(result.length > 0){
            return res.json({
                success: false,
                message: 'El equipo aún se encuentra en mantenimiento'
            });
        }else{
            const mantenimiento = new MantenimientoModel({
                equipo,
                detalleMantenimiento
            });
    
            await mantenimiento.save();
            return res.json({
                success: true,
                message: 'Equipo agregado para mantenimiento'
            });
        }

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