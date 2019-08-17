const {Schema, model} = require('mongoose');

const ClienteModel = new Schema({
    tipoPersona: {
        type: String,
        require: true,
        unique: true,
        uppercase: true
    },
    name: {
        type: String,
        required: true,    
        unique: true,
        uppercase: true
    },
    direccion: {
        type: String,
        //required: true,    
        unique: true,
        uppercase: true  
    },
    cedula: {
        type: String,
        required: true,    
        unique: true
    },
    telefono: {
        type: String,
        //required: true,    
        unique: true
    },
    ruc: {
        type: String,
        //required: true,    
        unique: true
    },
    cod_cuenta: {
        type: String,
        //required: true,    
        unique: true
    }

});

module.exports = model('Cliente', ClienteModel);