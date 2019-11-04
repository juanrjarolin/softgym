const equipoController = {};
const EquipoModel = require('../models/Maquina');
const moment = require('moment');
moment.locale('es');

equipoController.getEquipos = async(req, res) => {
    try {
        const equipos = await EquipoModel.find();
        res.json(equipos);
    } catch (error) {
        res.json({
            success: false,
            message: error
        });
    }
};

equipoController.getEquipo = async(req, res) => {
    try {
        const equipo = await EquipoModel.findById(req.params.id);
        res.json(equipo);
    } catch (error) {
        res.json({
            success: false,
            message: 'Ha ocurrido un error'
        });
    }
};

equipoController.createEquipo = async(req, res) => {
    const {nombre, cod_equipo, marca, costo, categoria, descripcion, estadoCompra, periodoMantenimiento, pertenencia} = req.body;

    if(!nombre){
        return res.json({
            success: false,
            message: 'El nombre del equipo no puede estar vacio'
        });
    }

    if(!estadoCompra){
        return res.json({
            success: false,
            message: 'Se debe agregar un estado inicial de la máquina'
        });
    }

    if(!cod_equipo){
        return res.json({
            success: false,
            message: 'El codigo del equipo no puede estar vacio'
        });
    }

    if(!costo){
        return res.json({
            success: false,
            message: 'El costo del equipo no puede estar vacio'
        });
    }

    if(!marca){
        return res.json({
            success: false,
            message: 'Se requiere la marca del equipo'
        });
    }

    if(!categoria){
        return res.json({
            success: false,
            message: 'Debe seleccionar una categoría'
        });
    }

    if(!pertenencia){
        return res.json({
            success: false,
            message: 'Debe seleccionar si el equipo es propio o alquilado'
        });
    }

    if(!periodoMantenimiento){
        return res.json({
            success: false,
            message: 'Debe ingresar un periodo de mantenimiento en meses'
        });
    }

    const fechaMantenimiento = moment().add(periodoMantenimiento, 'months').calendar();

    try {
        const result = await EquipoModel.find({cod_equipo: cod_equipo});
        if(result.length > 0){
            return res.json({
                success: false,
                message: 'El equipo ya existe'
            });
        }else{
            const newEquipo = new EquipoModel({
                nombre,
                cod_equipo,
                costo,
                marca,
                categoria,
                descripcion,
                estadoCompra,
                periodoMantenimiento,
                fechaMantenimiento,
                pertenencia
            });

            await newEquipo.save();
            return res.json({
                success: true,
                message: 'Equipo creado satisfactoriamente'
            });

        }
    } catch (error) {
        return res.json({
            success: false,
            message: 'Ha ocurrido un error',
            error: error.errors
        });
    }
};

equipoController.updateEquipo = async(req, res) => {
    try {
        await EquipoModel.findByIdAndUpdate({_id: req.params.id}, req.body);
        res.json({
            success: true,
            message: 'Actualización exitosa'
        });
    } catch (error) {
        res.json({
            success: false,
            message: 'Ha ocurrido un error'
        });
    }
};

equipoController.deleteEquipo = async(req, res) => {
    try {
        await EquipoModel.findByIdAndDelete(req.params.id);
        res.json({
            success: true,
            message: 'Equipo eliminado'
        });
    } catch (error) {
        res.json({
            success: false,
            message: 'Ha ocurrido un error'
        });
    }
};

module.exports = equipoController;