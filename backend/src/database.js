const mongoose = require('mongoose');

const URI = process.env.MONGODB_URI
    ? process.env.MONGODB_URI
    : 'mongodb://localhost/gymdb';

mongoose.connect(URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
});

const connection = mongoose.connection;

connection.once('open', () => {
    console.log('Database is connected');
});

/*
db.users.insert({
    firstName: "admin",
    lastName: "admin",
    "email": "admin@email.com",
    "password": "admin",
    "role": "admin"
});
*/