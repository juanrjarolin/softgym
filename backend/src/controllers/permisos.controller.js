const PermisoModel = require('../models/Permisos');
module.exports = {
    async getPermisos(req, res){
        try {
            const permisos = await PermisoModel.find();
            res.json(permisos);
        } catch (error) {
            res.json({
                success: false,
                message: 'Ocurrió un error al recuperar los datos'
            });
        }
    },

    async editPermiso(req, res){
        try {
            const permisos = await PermisoModel.findOne({rol: req.params.id});
            await PermisoModel.findByIdAndUpdate({_id: permisos._id}, req.body);
            res.json({
                success: true,
                message: 'Se ha actualizado los permisos del rol. Es necesario volver a iniciar sesión para visualizar los cambios.'
            });
        } catch (error) {
            res.json({
                success: false,
                message: 'Ocurrió un error'
            });
        }
    },

    async getPermiso(req, res){
        try {
            const permisosRol = await PermisoModel.findOne({rol: req.params.id});
            res.json(permisosRol.permisos);
        } catch (error) {
            res.json({
                success: false,
                message: 'Error al recuperar permisos del rol'
            });
        }
    },

    async createPermiso(req, res){
        const {rol, permisos} = req.body
        
        try {
            const newPermiso = new PermisoModel({
                rol,
                permisos
            });

            await newPermiso.save();
            res.json({
                success: true,
                message: 'Los permisos fueron creados'
            });
        } catch (error) {
            res.json({
                success: false,
                message: 'Ocurrió un error'
            });
        }
    },

    async deletePermiso(req, res){
        try {
            await PermisoModel.findByIdAndDelete(req.params.id);
            res.json({
                success: true,
                message: 'Permiso eliminado'
            });
        } catch (error) {
            res.json({
                success: false,
                message: 'No se pudo eliminar'
            });
        }
    }
}