const classController = {};

const ClassModel = require('../models/Class');

classController.createClass = async (req, res) =>{
    const {name, cantidadClass, horario} = req.body;

    if(!name){
        return res.json({
            success: false,
            message: 'El nombre de la clase no puede estar vacía'
        });
    }
    
    if(!cantidadClass){
        return res.json({
            success: false,
            message:'La cantidad debe ser ingresada'
        });
    }
    if(!horario){
        return res.json({
            success: false,
            message: 'El horario debe ser ingresado'
        });
    }
    
     
    const newClase = new ClassModel({
        name,
        cantidadClass,
        horario,
    });

    await newClase.save((err,clase) => {
        if (clase){
            res.json({
                success: true,
                message: 'Se ha insertado la clase correctamente'
            })
        }else{
            res.json({
                success: false,
                message: 'Vaya!'
            })
        }
    });
};

classController.deleteClass = async (req, res) =>{
    await ClassModel.findByIdAndDelete(req.params.id);
    res.json({
        success: true,
        message: 'Clase eliminada exitosamente'
    });
};

classController.getClass = async (req, res) =>{
    const clase = await ClassModel.findById(req.params.id);
    res.json(clase);
};

classController.getClases = async(req,res) =>{
    const clases = await ClassModel.find();
    res.json(clases);
};

classController.updateClass = async(req, res) => {
    await ClassModel.findByIdAndUpdate({_id: req.params.id}, req.body);
    res.json({
        success: true,
        message: 'Clase actualizado'
    });
};

classController.deleteClass = async(req, res) => { 
    await ClassModel.findByIdAndDelete({_id: req.params.id}, req.body);
    res.json({
        success:true,
        message:'Clase eliminada'
    });  
}

module.exports = classController;
