const {Schema, model} = require('mongoose');

const ClassModel = new Schema({

    name: {
        type: String,
        required: true,
	    uppercase:true
    },

    cantidadClass: {
        type: Number,
        required: true  
    },

    horario: {
        type: String,
        required: true
    }

}, {
    timestamps: false
});

module.exports = model('Class', ClassModel);
