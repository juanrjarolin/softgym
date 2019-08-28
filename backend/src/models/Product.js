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
        required: true
    },

    cost: {
        type: Number,
        required: true  
    },

    stockActual: {
        type: Number
    },

    minimumStock: {
        type: Number,
        required:true
    },
    
    lastPurchase:{
        type: Date
    }
   
});

module.exports = model('Product',ProductModel);
