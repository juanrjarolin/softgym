const {Schema, model} = require('mongoose');
const autopopulate = require('mongoose-autopopulate');

const DetalleMantenimientoSchema = new Schema({
    mantenimiento: {
        type: Schema.Types.ObjectId,
        ref: 'Mantenimiento',
        autopopulate: true
    },

    maquina: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Maquina',
        autopopulate: true
    },

    detalle: {
        type: String,
        required: true
    },
    
    costo: {
        type: Number,
        required: true
    }

}, {
    timestamps: false
});

DetalleMantenimientoSchema.plugin(autopopulate);

module.exports = model('DetalleMantenimiento', DetalleMantenimientoSchema);