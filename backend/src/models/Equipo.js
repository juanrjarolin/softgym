const {Schema, model} = require('mongoose');

const EquipoSchema = new Schema({
    nombre: {
        type: String,
        required: true,
        unique: true
    },

    cod_equipo: {
        type: String,
        required: true,
        unique: true
    },

    descripcion: {
        type: String,
        required: true
    },

    costo: {
        type: Number,
        required: true
    },

    dia_mantenimiento: {
        type: Number,
        required: true,
        default: 10
    },

    ultimoMantenimiento: {
        type: String
    }
}, {
    timestamps: false
});

module.exports = model('Equipo', EquipoSchema);