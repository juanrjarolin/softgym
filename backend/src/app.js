const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const bodyparser = require('body-parser');
const path = require('path');

const app = express();

// settings
app.set('port', process.env.PORT || 4000);

//static files
app.use(express.static(path.join(__dirname, 'public')));

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
app.use('/api/account', require('./routes/users.routes')); //usuarios
app.use('/api/products', require('./routes/products.routes')); //productos
app.use('/api/rols', require('./routes/roles.routes')); //roles de usuario
app.use('/api/sessions', require('./routes/sessions.routes')); //sesiones de usuario
app.use('/api/ventas', require('./routes/ventas.routes')); //ventas
app.use('/api/detalle-ventas', require('./routes/detalleVentas.routes')); //detalle ventas
app.use('/api/equipos', require('./routes/equipos.routes')); //Equipos del gimnasio
app.use('/api/categoriaMaquinas', require('./routes/categoriaMaquinas.routes')); //categorias maquinas
app.use('/api/mantenimiento', require('./routes/mantenimientos.routes')); //mantenimiento de equipos
app.use('/api/clases', require('./routes/class.routes')); //clases
app.use('/api/sucursales', require('./routes/sucursales.routes')); //sucursales
app.use('/api/reservas', require('./routes/reservas.routes')); //reservas
app.use('/api/permisos', require('./routes/permisos.routes')); //permisos
app.use('/api/personas', require('./routes/personas.routes'));

module.exports = app;