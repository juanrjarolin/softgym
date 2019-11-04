const {model, Schema} = require('mongoose');

const CategoriaMaquinaSchema = new Schema({
    nombre: {
        type: String,
        required: true,
        uppercase: true
    }
}, {
    timestamps: false
});

module.exports = model('CategoriaMaquina', CategoriaMaquinaSchema);