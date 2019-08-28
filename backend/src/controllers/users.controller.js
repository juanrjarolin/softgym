const userController = {};

//importaciones de módulos
const util = require('util');
const sleep = util.promisify(setTimeout);
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt-nodejs');
const passGenerator = require('generate-password');
const UserModel = require('../models/User');
const UserSessionModel = require('../models/UserSession');
const moment = require('moment');
const momentTZ = require('moment-timezone');
moment.locale('es');
momentTZ.locale('es');

//importando método de controlador para el envio de email
const { sendEmail } = require('./email.controller');

//definiendo los métodos para el rest api account users
//login
userController.login = async (req, res, next) => {
    const { email, password } = req.body;

    //verifica los atributos
    if (!email) {
        return res.json({
            success: false,
            message: 'El email no puede estar vacío'
        });
    }

    if (!password) {
        return res.json({
            success: false,
            message: 'La contraseña no puede estar vacía'
        });
    }

    //busca el usuario
    await UserModel.findOne({email})
        .then(user => {
            if (user) {
                if(user.isPassChanged){
                    //compara el pass recibido con el pass encriptado
                    if (user.compararPassword(password)) {
                        //se genera un token para el usuario logueado, con los datos del mismo
                        const payload = {
                            _id: user._id,
                            firstName: user.firstName,
                            lastName: user.lastName,
                            email: user.email,
                            role: user.role.name
                        }
                        let token = jwt.sign(payload, process.env.SECRET_KEY, {
                            expiresIn: 1440
                        });

                        //se guarda la sesion
                        const userSession = new UserSessionModel({
                            userToken: token,
                            dateSession: moment().format('LLL')
                        });
                        
                        userSession.save();
                        //se envía el token
                        res.send(token);
                    }else{
                        return res.json({
                            success: false,
                            message: 'Contraseña incorrecta'
                        });
                    }
                }else{
                    //cambio de pass
                    if(password === user.password){
                        return res.json({
                            success: 'warning',
                            message: 'Debe cambiar el password',
                            data: user
                        });
                    }else{
                        return res.json({
                            success: false,
                            message: 'Contraseña incorrecta'
                        });
                    }
                }
            } else {
                return res.json({
                    success: false,
                    message: 'No existe usuario'
                });
            }
        })
        .catch(err => {
            //si ocurrió algún error en el back
            if (err) {
                return res.json({
                    success: false,
                    message: 'Error: Server error'
                });
            }
        });
};

//método para verificar si existe un usuario en una sesión, o denegar acceso
userController.verificarUsuario = async (req, res, next) => {
    const token = req.headers['authorization'];
    
    if(token){
        await UserSessionModel.findOne({
            userToken: token
        })
            .then(sesion => {
                if(sesion){
                    next();
                }else{
                    res.json({
                        success: false,
                        message: 'No has iniciado sesión'
                    })
                }
            })
            .catch(err => {
                res.json({
                    success: false,
                    message: err
                })
            })
    }else{
        res.json({
            success: false,
            message: 'Acceso denegado'
        });
    }
};

//método para mostrar usuarios
userController.getUsers = async (req, res) => {
    const users = await UserModel.find();
    res.json(users);
        /*
        exec(function (err, user) {
        if (err) return handleError(err);
            console.log('The user is %s', user);
        });*/
};

//método para crear un usuario
userController.createUser = async (req, res) => {
    const { firstName, lastName, email, role } = req.body;

    //SE VALIDAN LOS ATRIBUTOS CORRESPONDIENTES
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

    if (!email) {
        return res.json({
            success: false,
            message: 'El email no puede estar vacío'
        });
    }

    if(!role){
        return res.json({
            success: false,
            message: 'Seleccione un rol'
        });
    }

    //CONSULTA SI YA EXISTE EL USUARIO
    const user = await UserModel.find({ email: email });

    if (user.length > 0) {
        return res.json({
            success: false,
            message: 'Error: El usuario ya existe'
        });
    } else {
        //GENERA UN PASS POR DEFECTO
        var password = passGenerator.generate({
            length: 8,
            numbers: true
        });

        const newUser = new UserModel({
            firstName,
            lastName,
            email,
            password,
            role
        });

        await newUser.save((err, user) => {
            if (err) {
                return res.json({
                    success: false,
                    message: 'Ha ocurrido un error, verificar los campos requeridos.',
                    data: err.errors
                });
            } else {
                //MENSAJE PARA EL EMAIL
                message = `
                    <div>
                        <h3>Cambio de Contraseña</h3>
                        <p>Has recibido una contraseña generada por softgym para el acceso al sistema. Softgym solicitará cambiar la contraseña al momento de iniciar la sesión.</p>
                        <p>Su contraseña de usuario es: ${password}</p>
                        <footer>
                            <address>
                                SoftGym v2
                            </address>
                        </footer>
                    </div>
                `
                //SE HACE USO DEL MÉTODO SEND PARA ENVIAR EL EMAIL
                sendEmail(email, message, 'Notificación de nuevo usuario');
                return res.json({
                    success: true,
                    message: 'Usuario creado satisfactoriamente',
                    data: user,
                    emailMessage: 'Se ha enviado el email al correo proporcionado'
                });
            }
        });
    }
}

//método para mostrar un usuario
userController.getUser = async (req, res) => {
    const user = await UserModel.findById(req.params.id);
    res.json(user);
};

//método para eliminar un usuario
userController.deleteUser = async (req, res) => {
    await UserModel.findByIdAndDelete(req.params.id);
    res.json({
        success: true,
        message: "Usuario eliminado"
    });
};

//método para actualizar un usuario
userController.updateUser = async (req, res) => {
    await UserModel.findOneAndUpdate({ _id: req.params.id }, req.body);
    res.json({
        success: true,
        message: "Usuario actualizado"
    });   
};

//método para cambiar el pass del usuario al iniciar la sesion
userController.updatePassword = async (req, res) => {
    var { password } = req.body;
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, null, async (err, hash) => {
            if (err) {
                console.error(err)
            }
            password = hash;
            req.body.password = password;
            await UserModel.findOneAndUpdate({ _id: req.params.id }, req.body);
            res.json({
                success: true,
                message: "Contraseña actualizada"
            });
        });
    });
}

//método para controlar las peticiones hechas por el usuario
userController.afterActions = async (req, res, next) => {

    try {
        var recurso = '';
        const token = req.headers['authorization'];
        const session = await UserSessionModel.findOne({userToken:token});
        
        //consulta sobre el recurso solicitado
        if(req.baseUrl === '/api/account'){
            recurso = 'usuarios';
        }else if(req.baseUrl === '/api/products'){
            recurso = 'productos';
        }else if(req.baseUrl === '/api/rols'){
            recurso = 'roles';
        }

        //consulta sobre el método utilizado
        if(req.method === 'GET'){
            if(!req.params.id){
                session.actions.push(`Consulta de ${recurso}`);
                session.dateActions = new moment();
            }else{
                session.actions.push(`Consulta para actualización de ${recurso}`);
                session.dateActions = new moment();
            }
        }else if(req.method === 'POST'){
            session.actions.push(`Creación de ${recurso}`);
            session.dateActions = new moment();
        }else if(req.method === 'PUT'){
            session.actions.push(`Actualización de ${recurso}`);
            session.dateActions = new moment();
        }else if(req.method === 'DELETE'){
            session.actions.push(`Eliminación de ${recurso}`);
            session.dateActions = new moment();
        }

        let conjunto = [...new Set(session.actions)];
        session.actions = conjunto;
        await session.save();
        next(); 
    } catch (error) {
        console.log(error);
    }
}

module.exports = userController;