const {Schema, model} = require('mongoose');

const ProductSchema = new Schema({
    nombre: {
        type: String,
        required: true,    
        unique: true,
        uppercase: true
    },

    precio: {
        type: Number,
        required: true
    },

    costo: {
        type: Number,
        required: true  
    },

    stockActual: {
        type: Number
    },

    stockMinimo: {
        type: Number,
        required:true
    },
    
    ultimaCompra:{
        type: Date
    }
   
}, {
    timestamps: false
});

module.exports = model('Product',ProductSchema);
