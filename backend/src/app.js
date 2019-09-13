const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const morgan = require('morgan');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
//require('mongoose-moment')(mongoose);

const app = express();

// settings
app.set('port', process.env.PORT || 4000);

// middlewares
app.use(bodyparser.json());
app.use(cors());
app.use(
    bodyparser.urlencoded({
        extended: true
    })
);
app.use(express.json());
app.use(morgan('dev'));

process.env.SECRET_KEY = 'gympotencial';

// end points
<<<<<<< HEAD
app.use('/api/account', require('./routes/users.routes'));
app.use('/api/roles', require('./routes/roles.routes'));
app.use('/api/products', require('./routes/products.routes'));
app.use('/api/rols', require('./routes/roles.routes'));
app.use('/api/cliente',require('./routes/clientes.routes'))
=======
app.use('/api/account', require('./routes/users.routes')); //usuarios
app.use('/api/products', require('./routes/products.routes')); //productos
app.use('/api/rols', require('./routes/roles.routes')); //roles de usuario
app.use('/api/sessions', require('./routes/sessions.routes')); //sesiones de usuario
app.use('/api/ventas', require('./routes/ventas.routes')); //ventas
app.use('/api/detalle-ventas', require('./routes/detalleVentas.routes')); //detalle ventas
app.use('/api/proveedores', require('./routes/proveedores.routes')); //proveedores
app.use('/api/equipos', require('./routes/equipos.routes')); //Equipos del gimnasio
app.use('/api/mantenimiento', require('./routes/mantenimientos.routes')); //mantenimiento de equipos
app.use('/api/clases', require('./routes/class.routes')); //clases
app.use('/api/sucursales', require('./routes/sucursales.routes')); //sucursales
app.use('/api/reservas', require('./routes/reservas.routes')); //reservas
>>>>>>> b0f2ff919dc24324b8df6406e50ad81f619608e1

module.exports = app;