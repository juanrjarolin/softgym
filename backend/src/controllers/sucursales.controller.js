const sucursalController = {};
const SucursalModel = require('../models/Sucursal');

sucursalController.getSucursales = async(req, res) => {
    try {
        const sucursales = await SucursalModel.find();
        res.json(sucursales);
    } catch (error) {
        console.log(error);
    }
};

sucursalController.getSucursal = async(req, res) => {
    try {
        const sucursal = await SucursalModel.findById(req.params.id);
        res.json(sucursal);
    } catch (error) {
        console.log(error);
    }
};

sucursalController.createSucursal = async(req, res) => {
    const {localidad, direccion, telefono, cod_sucursal, clases} = req.body;

    if(!localidad){
        return res.json({
            success: false,
            message: 'La localidad no puede estar vacía'
        });
    }

    if(!direccion){
        return res.json({
            success: false,
            message: 'La dirección no puede estar vacía'
        });
    }

    if(!telefono){
        return res.json({
            success: false,
            message: 'El teléfono no puede estar vacío'
        });
    }

    if(!cod_sucursal){
        return res.json({
            success: false,
            message: 'Debe ingresar el código de sucursal'
        });
    }

    if(!clases){
        return res.json({
            success: false,
            message: 'Seleccione las clases'
        });
    }

    try {
        const result = await SucursalModel.find({cod_sucursal: cod_sucursal});
        if(result.length > 0){
            return res.json({
                success: false,
                message: 'Ya existe sucursal'
            });
        }else{
            const newSucursal = new SucursalModel({
                cod_sucursal,
                direccion,
                localidad,
                telefono,
                clases
            });

            await newSucursal.save();
            return res.json({
                success: true,
                message: 'Sucursal guardada satisfactoriamente'
            });
        }
    } catch (error) {
        return res.json({
            success: false,
            message: 'Ha ocurrido un error'
        });
    }
};

sucursalController.updateSucursal = async(req, res) => {
    try {
        await SucursalModel.findByIdAndUpdate({_id: req.params.id}, req.body);
        res.json({
            success: true,
            message: 'Sucursal actualizada con éxito'
        });
    } catch (error) {
        res.json({
            success: false,
            message: 'Ha ocurrido un error'
        });
    }
};

sucursalController.deleteSucursal = async(req, res) => {
    try {
        await SucursalModel.findByIdAndDelete(req.params.id);
        res.json({
            success: true,
            message: 'Se ha eliminado la sucursal'
        });
    } catch (error) {
        console.log(error);
    }
};

module.exports = sucursalController;