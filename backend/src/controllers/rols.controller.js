const rolController = {};

const RolModel = require('../models/Rol');

rolController.getRols = async (req, res) => {
    const roles = await RolModel.find();
    res.json(roles);
};

rolController.getRol = async (req, res) => {
    const rol = await RolModel.findById(req.params.id);
    res.json(rol);
};

rolController.createRol = async (req, res) => {
    const {name} = req.body; //obtiene el dato nombre del request
    if(!name){
        return res.json({
            success: false,
            message: 'El nombre del rol está vacío'
        });
    }

    //verifica si existe un rol con el mismo nombre
    const rol = await RolModel.find({ name: name}); 

    if (rol.length > 0) {
        return res.json({
            success: false,
            message: 'Error: El rol ya existe'
        });
    }else{
        const newRol = new RolModel({name});
        await newRol.save((err, rol) => {
            if(err){
                return res.json({
                    success: false,
                    message: 'Error. Los nombres requeridos para los roles son: administrador, vendedor o cliente.'
                });
            }else{
                return res.json({
                    success: true,
                    message: 'Rol creado',
                    data: rol.name
                });
            }
        });
    }
}

rolController.updateRol = async(req, res) => {
    try {
        const {name} = req.body;
        const rol = await RolModel.findById(req.params.id);
        rol.name = name;
        const newRol = await rol.save();
        console.log(newRol);
        res.json({
            success: true,
            message: "Rol actualizado"
        }); 
    } catch (error) {
        res.json({
            success: false,
            message: 'Rol no disponible'
        });
    }
}

rolController.deleteRol = async(req, res) => {
    try {
        const rol = await RolModel.findById(req.params.id)
        if(rol.name === "administrador"){
            res.json({
                success: false,
                message: 'No se puede eliminar el rol de administrador'
            });
        }else{
            await RolModel.findByIdAndDelete(req.params.id);
            res.json({
                success: true,
                message: "Rol eliminado"
            });
        }
    } catch (error) {
        res.json({
            success: false,
            message: "Ocurrió un error"
        });
    }
}

module.exports = rolController;