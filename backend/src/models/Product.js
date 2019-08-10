const {Schema, model} = require('mongoose');

const ProductModel = new Schema({
    name: {
        type: String,
        required: true,    
        unique: true,
        uppercase: true
    },
    price: {
        type: Number,
        required: true // seria el not null
    },
    cost: {
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
        type:Date
    } 
   
});

module.exports = model('Product',ProductModel);
