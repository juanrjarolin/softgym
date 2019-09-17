const {Schema, model} = require('mongoose');
const autopopulate = require('mongoose-autopopulate');

const PermisoSchema = new Schema({
    rol: {
        type: Schema.Types.ObjectId,
        ref: 'Rol',
        autopopulate: {select: 'name'}
    },

    permisos: {
        type: Map
    }
});

PermisoSchema.plugin(autopopulate);

module.exports = model('Permiso', PermisoSchema);