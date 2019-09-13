const {Schema, model} = require('mongoose');
const autopopulate = require('mongoose-autopopulate');

const SucursalSchema = new Schema({
    cod_sucursal: {
        type: String,
        required: true,
        unique: true
    },
    
    localidad: {
        type: String,
        required: true,
        uppercase: true
    },

    direccion: {
        type: String,
        required: true
    },

    telefono: {
        type: String,
        required: true
    },

    clases: {
        type: [Schema.Types.ObjectId],
        ref: 'Clase',
        autopopulate: {select: 'nombre'}
    }
}, {
    timestamps: false
});

SucursalSchema.plugin(autopopulate);

module.exports = model('Sucursal', SucursalSchema);