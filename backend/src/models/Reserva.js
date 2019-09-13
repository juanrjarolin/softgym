const {Schema, model} = require('mongoose');
const autopopulate = require('mongoose-autopopulate');
const ClaseModel = require('./Clase');

const ReservaSchema = new Schema({
    clase: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Clase',
        autopopulate: {select: 'nombre'}
    },

    cliente: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        autopopulate: {select: 'firstName'}
    },

    sucursal: {
        type: Schema.Types.ObjectId,
        ref: 'Sucursal',
        autopopulate: {select: 'localidad'},
        required: true
    },

    fechaReserva: String
}, {
    timestamps: false
});

ReservaSchema.plugin(autopopulate);

ReservaSchema.post('save', async(reserva) => {
    const clase = await ClaseModel.findById(reserva.clase);
    if(clase.cantidadPersona === clase.cantidadActual){
        clase.estado = "Llena"
        await clase.save()
    }
});

module.exports = model('Reserva', ReservaSchema);