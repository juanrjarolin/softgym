const {Schema, model} = require('mongoose');
const autopopulate = require('mongoose-autopopulate');

const MantenimientoSchema = new Schema({
    detalleMantenimiento: {
        type: String,
        required: true
    },

    equipo: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Equipo',
        autopopulate: {select: 'nombre'}
    },

    estado: {
        type: String,
        required: true,
        default: 'Iniciado'
    },

    completed: {
        type: Boolean,
        default: false,
        required: true
    }
}, {
    timestamps: false
});

MantenimientoSchema.plugin(autopopulate);

module.exports = model('Mantenimiento', MantenimientoSchema);