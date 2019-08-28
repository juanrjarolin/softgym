const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const morgan = require('morgan');
const bodyparser = require('body-parser');

const app = express();

// settings
app.set('port', process.env.PORT || 4000);

// middlewares
app.use(bodyparser.json());
app.use(cors());
app.use(
    bodyparser.urlencoded({
        extended: false
    })
);
app.use(express.json());
app.use(morgan('dev'));

process.env.SECRET_KEY = 'gympotencial';

// end points
app.use('/api/account', require('./routes/users.routes'));
app.use('/api/products', require('./routes/products.routes'));
app.use('/api/rols', require('./routes/roles.routes'));
app.use('/api/sessions', require('./routes/sessions.routes'));
app.use('/api/clases', require('./routes/class.routes'));

module.exports = app;