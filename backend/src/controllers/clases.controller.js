const claseController = {};

const ClaseModel = require('../models/Clase');

claseController.createClase = async (req, res) =>{
    const {nombre, cantidadPersona, horario, dias, cantidadActual} = req.body;

    if(!nombre){
        return res.json({
            success: false,
            message: 'El nombre de la clase no puede estar vacío'
        });
    }

    if(!dias){
        return res.json({
            success: false,
            message: 'Debe introducir los días de clase'
        });
    }
    
    if(!cantidadPersona){
        return res.json({
            success: false,
            message:'La cantidad de participantes debe ser ingresada'
        });
    }

    if(!horario){
        return res.json({
            success: false,
            message: 'El horario debe ser ingresado'
        });
    }

    if(!cantidadActual){
        return res.json({
            success: false,
            message: 'La cantidad actual debe ser ingresada'
        });
    }
    
     
    const newClase = new ClaseModel({
        nombre,
        cantidadPersona,
        horario,
        dias,
        cantidadActual
    });

    await newClase.save((err,clase) => {
        if (clase){
            res.json({
                success: true,
                message: 'La clase ha sido creada correctamente'
            })
        }else{
            res.json({
                success: false,
                message: 'Ocurrió un error'
            })
        }
    });
};

claseController.deleteClase = async (req, res) =>{
    await ClaseModel.findByIdAndDelete(req.params.id);
    res.json({
        success: true,
        message: 'Clase eliminada exitosamente'
    });
};

claseController.getClase = async (req, res) =>{
    try {
        const clase = await ClaseModel.findById(req.params.id);
        res.json(clase);
    } catch (error) {
        res.json({
            success: false,
            message: 'No se encontró la clase'
        });
    }
    
};

claseController.getClases = async(req,res) =>{
    const clases = await ClaseModel.find();
    res.json(clases);
};

claseController.updateClase = async(req, res) => {
    try {
        await ClaseModel.findByIdAndUpdate({_id: req.params.id}, req.body);
        const clase = await ClaseModel.findById(req.params.id);
        if(clase.cantidadActual < clase.cantidadPersona){
            clase.estado = "Disponible"
            await clase.save();
        }else{
            clase.estado = "Llena"
            await clase.save();
        }
        res.json({
            success: true,
            message: 'Clase actualizada'
        });
    } catch (error) {
        res.json({
            success: false,
            message: 'Ha ocurrido un error al actualizar'
        });
    }
};


module.exports = claseController;
