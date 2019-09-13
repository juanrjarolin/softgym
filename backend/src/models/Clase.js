const {Schema, model} = require('mongoose');

const ClaseSchema = new Schema({

    nombre: {
        type: String,
        required: true,
	    uppercase: true
    },

    cantidadPersona: {
        type: Number,
        required: true  
    },

    cantidadActual: {
        type: Number
    },

    dias: {
        type: String,
        required: true
    },

    horario: {
        type: String,
        required: true
    },

    estado: {
        type: String,
        default: "Disponible"
    }

}, {
    timestamps: false
});

module.exports = model('Clase', ClaseSchema);
