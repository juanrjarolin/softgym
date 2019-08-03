const {Schema, model} = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const validate = require('mongoose-validator');

const UserSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
        validate: [
            validate({
                validator: 'isLength',
                arguments: [3, 15],
                message: 'Se requiere entre {ARGS[0]} y {ARGS[1]} caracteres',
                httpStatus: 400
            }),
            validate({
                validator: 'isAlpha',
                message: 'Error: Introduzca su nombre correctamente',
                httpStatus: 400
            })
        ]
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        validate: [
            validate({
                validator: 'isLength',
                arguments: [3, 15],
                message: 'Se requiere entre {ARGS[0]} y {ARGS[1]} caracteres',
                httpStatus: 400
            }),
            validate({
                validator: 'isAlpha',
                message: 'Error: Introduzca su apellido correctamente',
                httpStatus: 400
            })
        ]
    },
    userName: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        validate: [
            validate({
                validator: 'isLength',
                arguments: [5, 15],
                message: 'Se requiere entre {ARGS[0]} y {ARGS[1]} caracteres',
                httpStatus: 400
            })
        ]
    },
    password: {
        type: String,
        required: true,
        validate: [
            validate({
                validator: 'isLength',
                arguments: [8, 15],
                message: 'Se requiere entre {ARGS[0]} y {ARGS[1]} caracteres',
                httpStatus: 400
            })
        ]
    },
    isDelete: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

UserSchema.pre('save', function(next){
    const usuario = this;
    if(!usuario.isModified('password')){
        return next();
    }
    bcrypt.genSalt(10, (err, salt) => {
        if(err){
            next(err);
        }
        bcrypt.hash(usuario.password, salt, null, (err, hash) => {
            if (err) {
                next(err);
            }
            usuario.password = hash;
            next();
        });
    });
});

UserSchema.methods.compararPassword = function(password){
    return bcrypt.compareSync(password, this.password);
}

module.exports = model('User', UserSchema);