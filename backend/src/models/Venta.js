const {Schema, model} = require('mongoose');
const autopopulate = require('mongoose-autopopulate');

const VentaSchema = new Schema({
    num_factura: {
        type: String,
        required: true
    },

    fecha: {
        type: Date,
        required: true
    },

    monto_total: {
        type: Number,
        required: true
    },

    cliente: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Cliente',
        autopopulate: true
    },

    plazo: {
        type: Number,
        required: true
    },

    tipo_venta: {
        type: String,
        required: true
    }
}, {
    timestamps: false
});

VentaSchema.plugin(autopopulate);

module.exports = model('Venta', VentaSchema);