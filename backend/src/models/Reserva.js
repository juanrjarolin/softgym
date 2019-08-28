const {Schema, model} = require('mongoose');

const ReservaSchema = new Schema({
    clase: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Clase',
        autopopulate: {select: 'name'}
    },

    estado: {
        type: Boolean,
        default: false
    }
});

module.exports = model('Reserva', ReservaSchema);