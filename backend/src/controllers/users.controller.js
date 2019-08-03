const userController = {};
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt-nodejs');

const UserModel = require('../models/User');
const UserSessionModel = require('../models/UserSession');

userController.login = (req, res) => {
    const {userName, password} = req.body;

    if(!userName){
        return res.json({
            success: false,
            message: 'El nombre de usuario no puede estar vacío'
        });
    }

    if(!password){
        return res.json({
            success: false,
            message: 'La contraseña no puede estar vacía'
        });
    }

    UserModel.findOne({
        userName
    })
        .then(user => {
            if(user){
                if (user.compararPassword(password)) {
                    const payload = {
                        _id: user._id,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        userName: user.userName
                    }
                    let token = jwt.sign(payload, process.env.SECRET_KEY, {
                        expiresIn: 1440
                    });

                    res.send(token);
                    /*
                    const userSession = new UserSessionModel();
                    userSession.userId = user._id;
                    userSession.save((err, session) => {
                        if (err) {
                            return res.json({
                                success: false,
                                message: 'Error: Server error'
                            });
                        }
                    });*/
                }else{
                    return res.json({
                        success: false,
                        message: 'Contraseña incorrecta'
                    });
                }
            }else{
                return res.json({
                    success: false,
                    message: 'No existe usuario'
                });
            }
        })
        .catch(err => {
            if (err) {
                return res.json({
                    success: false,
                    message: 'Error: Server error'
                });
            }
        });
};

userController.verificarUsuario = async (req, res) => {
    var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY);
    console.log(decoded);
    
    await UserModel.findOne({
        _id: decoded._id
    })
        .then(user => {
            if(user){
                res.json(user);
            }else{
                res.send('User does not exist');
            }
        })
        .catch(err => {
            res.send('Error' + err);
        });
};

userController.getUsers = async (req, res) => {
    const users = await UserModel.find();
    res.json(users);
};

userController.createUser = async (req, res) => {
    const {firstName, lastName, userName, password} = req.body;

    if (!firstName) {
        return res.json({
            success: false,
            message: 'El nombre no puede estar vacío'
        });
    }
    if (!lastName) {
        return res.json({
            success: false,
            message: 'El apellido no puede estar vacío'
        });
    }
    if (!userName) {
        return res.json({
            success: false,
            message: 'El nombre de usuario no puede estar vacío'
        });
    }
    if (!password) {
        return res.json({
            success: false,
            message: 'La contraseña no puede estar vacía'
        });
    }

    const user = await UserModel.find({userName: userName});
    
    if(user.length>0){
        return res.json({
            success: false,
            message: 'Error: El usuario ya existe'
        });
    }else{
        const newUser = new UserModel({
            firstName,
            lastName,
            userName,
            password
        });
        await newUser.save((err, user) => {
            if(err){
                return res.json({
                    success: false,
                    message: 'Ha ocurrido un error, verificar los campos requeridos.',
                    data: err.errors
                });
            }
            return res.json({
                success: true,
                message: 'Usuario creado satisfactoriamente'
            });
        });
    }
}

userController.getUser = async (req, res) => {
    const user = await UserModel.findById(req.params.id);
    res.json(user);
};

userController.deleteUser = async (req, res) => {
   await UserModel.findByIdAndDelete(req.params.id);
   res.json({message: "Usuario eliminado"});
};

userController.updateUser = async (req, res) => {
    var {password} = req.body;
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, null, async (err, hash) => {
            if (err) {
                console.error(err)
            }
            password = hash;
            req.body.password = password;
            await UserModel.findOneAndUpdate({_id: req.params.id}, req.body);
            res.json({message: "Usuario actualizado"});
        });
    });
};


module.exports = userController;