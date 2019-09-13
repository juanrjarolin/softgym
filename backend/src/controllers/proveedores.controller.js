const proveedorController = {};

const ProveedorModel = require('../models/Proveedor');

proveedorController.getProveedor = async (req, res) => {
    const proveedor = await ProveedorModel.findById(req.params.id);
    res.json(proveedor);
};

proveedorController.getProveedores = async (req, res) => {
    const proveedores = await ProveedorModel.find();
    res.json(proveedores);
};

proveedorController.createProveedor = async (req, res) => {
    const { nombre, apellido, direccion, telefono, correo, cedula } = req.body;

    if(!nombre){
        return res.json({
            success: false,
            message: 'El nombre no puede estar vacío'
        });
    }

    if(!apellido){
        return res.json({
            success: false,
            message: 'El apellido no puede estar vacío'
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
            message: 'El telefono no puede estar vacío'
        });
    }

    if(!cedula){
        return res.json({
            success: false,
            message: 'La cédula no puede estar vacía'
        });
    }

    if(!correo){
        return res.json({
            success: false,
            message: 'El correo no puede estar vacío'
        });
    }

    try {
        const proveedor = await ProveedorModel.find({cedula: cedula});
        if (proveedor.length > 0){
            res.json({
                success: false,
                message: 'Ya existe proveedor'
            });
        }else{
            const newProveedor = new ProveedorModel({
                nombre,
                apellido,
                cedula,
                direccion,
                telefono,
                correo
            });
            await newProveedor.save((err, proveedor) => {
                if(err){
                    return res.json({
                        success: false,
                        message: 'Ha ocurrido un error, verificar los campos requeridos.',
                        data: err.errors
                    });
                }else{
                    return res.json({
                        success: true,
                        message: 'Proveedor creado satisfactoriamente',
                        data: proveedor
                    });
                }
            })
        }
            
    } catch (error) {
        return res.json({
            success: false,
            message: 'Ha ocurrido un error',
            data: error
        });
    }
};

proveedorController.updateProveedor = async (req, res) => {
    await ProveedorModel.findOneAndUpdate({ _id: req.params.id }, req.body);
    res.json({
        success: true,
        message: "Proveedor actualizado"
    }); 
};

proveedorController.deleteProveedor = async (req, res) => {
    try {
        await ProveedorModel.findByIdAndDelete(req.params.id);
        res.json({
            success: true,
            message: 'Proveedor eliminado'
        });
    } catch (error) {
        res.json({
            success: false,
            message: 'Ocurrió un error'
        });
    }
};

module.exports = proveedorController;