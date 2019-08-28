//IMPORTANDO EL ESQUEMA Y MODELO DE MONGOOSE
const {Schema, model} = require('mongoose');
const bcrypt = require('bcrypt-nodejs'); // MÉTODO PARA ENCRIPTACIÓN
const validate = require('mongoose-validator'); //MÉTODO PARA VALIDACIONES
const autopopulate = require('mongoose-autopopulate'); //MÉTODO DE AUTOPOBLACIÓN

//CREANDO EL ESQUEMA USERS
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

    email: {
        type: String,
        required: true,
        unique: true
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
    },

    role: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Rol',
        autopopulate: {select: 'name'}
    },

    isPassChanged:{
        type: Boolean,
        default: false
    }
}, {
    timestamps: false,
});
UserSchema.plugin(autopopulate);
/*
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

*/

UserSchema.methods.compararPassword = function(password){
    return bcrypt.compareSync(password, this.password);
}

//EXPORTANDO EL MODELO USER UTILIZANDO EL ESQUEMA CREADO PARA EL USER
module.exports = model('User', UserSchema);