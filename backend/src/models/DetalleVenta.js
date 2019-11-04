const {Schema, model} = require('mongoose');
const autopopulate = require('mongoose-autopopulate'); //MÉTODO DE AUTOPOBLACIÓN

//Schema de un detalle de venta
const DetalleVentaSchema = new Schema({
    producto: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Product',
        autopopulate: true
    },

    venta: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Venta',
        autopopulate: true
    },

    cantidad: {
        type: Number,
        required: true
    },

    precio: {
        type: Number,
        required: true
    }
}, {
    timestamps: false
});
DetalleVentaSchema.plugin(autopopulate);

module.exports = model('DetalleVenta', DetalleVentaSchema);