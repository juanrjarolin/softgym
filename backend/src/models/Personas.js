const {Schema, model} = require('mongoose');

const PersonaModel = new Schema({
    tipo_persona: {
        type: String,
        required: true,
        uppercase: true
    },
    
    nombre: {
        type: String,
        required: true,    
        uppercase: true
    },

    apellido: {
        type: String,
        uppercase: true
    },

    direccion: {
        type: String,
        uppercase: true,
        required: true
    },

    cedula: {
        type: String,   
        unique: true
    },

    correo: {
        type: String,
        required: true,
        unique: true
    },

    telefono: {
        type: String,
        required: true,    
        unique: true
    },

    ruc: {
        type: String,   
        unique: true
    },

    cod_cuenta: {
        type: String,    
        unique: true
    },

    es_cliente: {
        type: Boolean,
        required: true
    },

    es_proveedor: {
        type: Boolean,
        required: true
    }

}, {
    timestamps: false
});

module.exports = model('Persona', PersonaModel);