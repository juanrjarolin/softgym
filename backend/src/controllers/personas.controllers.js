const personaController = {};

const PersonaModel = require('../models/Personas');

personaController.getPersona = async (req, res) => {
    const persona = await PersonaModel.findById(req.params.id);
    res.json(persona);
};

personaController.getPersonas = async (req, res) => {
    const tipo = req.params.tipo;
    if(tipo === 'proveedores'){
        const proveedores = await PersonaModel.find().where('es_proveedor').equals(true);
        res.json(proveedores);
    }else{
        const clientes = await PersonaModel.find().where('es_cliente').equals('true');
        res.json(clientes);
    }
};

personaController.createPersona = async (req, res) => {
    const { nombre, apellido, direccion, telefono, correo, cedula, es_cliente, es_proveedor, ruc, tipo_persona } = req.body;

    if(!nombre){
        return res.json({
            success: false,
            message: 'El nombre no puede estar vacío'
        });
    }

    if(!tipo_persona){
        return res.json({
            success: false,
            message: 'Debe seleccionar un tipo de persona'
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

    if(!correo){
        return res.json({
            success: false,
            message: 'El correo no puede estar vacío'
        });
    }

    try {
        const persona = await PersonaModel.find({correo: correo});
        if (persona.length > 0){
            res.json({
                success: false,
                message: 'El registro ya existe'
            });
        }else{
            const newPersona = new PersonaModel({
                nombre,
                apellido,
                cedula,
                direccion,
                telefono,
                correo,
                es_cliente,
                es_proveedor,
                tipo_persona,
                ruc
            });
            await newPersona.save((err, persona) => {
                if(err){
                    return res.json({
                        success: false,
                        message: 'Ha ocurrido un error, verificar los campos requeridos.',
                        data: err.errors
                    });
                }else{
                    return res.json({
                        success: true,
                        message: 'Persona creada satisfactoriamente',
                        data: persona
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

personaController.updatePersona = async (req, res) => {
    await PersonaModel.findOneAndUpdate({ _id: req.params.id }, req.body);
    res.json({
        success: true,
        message: "Actualizado"
    }); 
};

personaController.deletePersona = async (req, res) => {
    try {
        await PersonaModel.findByIdAndDelete(req.params.id);
        res.json({
            success: true,
            message: 'Eliminado'
        });
    } catch (error) {
        res.json({
            success: false,
            message: 'Ocurrió un error'
        });
    }
};

module.exports = personaController;