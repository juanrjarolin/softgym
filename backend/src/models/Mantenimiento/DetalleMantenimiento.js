const {Schema, model} = require('mongoose');
const autopopulate = require('mongoose-autopopulate');

const DetalleMantenimientoSchema = new Schema({
    mantenimiento: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Mantenimiento'
    },

    maquinas: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Maquina'
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

MantenimientoSchema.plugin(autopopulate);

module.exports = model('DetalleMantenimiento', DetalleMantenimientoSchema);