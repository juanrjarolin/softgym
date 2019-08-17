const {Schema, model} = require('mongoose');
const validate = require('mongoose-validator');

const RolSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        enum: ['administrador', 'cliente', 'vendedor'],
        validate: [
            validate({
                validator: 'isLength',
                arguments: [3, 15],
                message: 'Se requiere entre {ARGS[0]} y {ARGS[1]} caracteres',
                httpStatus: 400
            }),
            validate({
                validator: 'isAlpha',
                message: 'Error: Introduzca el nombre correctamente',
                httpStatus: 400
            })
        ]
    }
});

module.exports = model('Rol', RolSchema);