const {Schema, model} = require('mongoose');

const ProveedorSchema = new Schema({
    nombre: {
        type: String,
        required: true
    },

    apellido: {
        type: String,
        required: true
    },

    direccion: {
        type: String,
        required: true
    },

    telefono: {
        type: String,
        required: true
    },

    cedula: {
        type: String,
        required: true,
        unique: true
    },

    correo: {
        type: String,
        required: true,
        unique: true
    }
}, {
    timestamps: false
});

module.exports = model('Proveedor', ProveedorSchema);