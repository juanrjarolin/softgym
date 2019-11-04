const {Schema, model} = require('mongoose');

const MaquinaSchema = new Schema({
    nombre: {
        type: String,
        required: true,
        unique: true
    },

    cod_equipo: {
        type: String,
        required: true,
        unique: true,
        uppercase: true
    },

    marca: {
        type: String,
        required: true
    },

    categoria: {
        type: Schema.Types.ObjectId,
        ref: 'CategoriaMaquina',
        autopopulate: true
    },

    descripcion: {
        type: String
    },

    costo: {
        type: Number,
        required: true
    },

    estadoCompra: {
        type: String,
        required: true
    },

    ultimoMantenimiento: {
        type: String,
        default: "Aún no se ha realizado un mantenimiento preventivo"
    },

    ultimaReparacion: {
        type: String,
        default: "Aún no se ha realizado un mantenimiento correctivo"
    },

    cantMantenimiento: {
        type: Number,
        default: 0
    },

    cantReparacion: {
        type: Number,
        default: 0
    },

    totalCostoMantenimiento: {
        type: Number,
        default: 0
    },

    totalCostoReparacion: {
        type: Number,
        default: 0
    },

    periodoMantenimiento: {
        type: String,
        required: true
    },

    fechaMantenimiento: {
        type: String,
        required: true
    },

    pertenencia: {
        type: String,
        required: true
    }
}, {
    timestamps: false
});

MaquinaSchema.plugin(require('mongoose-autopopulate'));

module.exports = model('Maquina', MaquinaSchema);