const equipoController = {};
const EquipoModel = require('../models/Equipo');

equipoController.getEquipos = async(req, res) => {
    try {
        const equipos = await EquipoModel.find();
        res.json(equipos);
    } catch (error) {
        res.json({
            success: false,
            message: 'Ha ocurrido un error'
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
    const {nombre, cod_equipo, costo, descripcion} = req.body;

    if(!nombre){
        return res.json({
            success: false,
            message: 'El nombre del equipo no puede estar vacio'
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

    if(!descripcion){
        return res.json({
            success: false,
            message: 'La descripcion del equipo no puede estar vacia'
        });
    }

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
                descripcion
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