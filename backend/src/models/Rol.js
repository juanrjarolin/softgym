const {Schema, model} = require('mongoose');

const RolSchema = new Schema({
    name: {
        type: String,
        required: true
    }
});

module.exports = model('Rol', RolSchema);