const CategoriaMaquinaModel = require('../models/MaquinaCategoria');
module.exports = {
    async getCategoriaMaquinas(req, res){
        try {
           const categorias = await CategoriaMaquinaModel.find();
           res.json(categorias);
        } catch (error) {
            res.json({
                message: 'Ocurrió un error',
                success: false
            });
        }
    },

    async getCategoriaMaquina(req, res){
        try {
           const categoria = await CategoriaMaquinaModel.findById(req.params.id);
           res.json(categoria);
        } catch (error) {
            res.json({
                message: 'Ocurrió un error',
                success: false
            });
        }
    },

    async updateCategoriaMaquina(req, res){
        try {
           await CategoriaMaquinaModel.findByIdAndUpdate({_id: req.params.id}, req.body);
           res.json({
               success: true,
               message: 'Categoría actualizada'
           });
        } catch (error) {
            res.json({
                message: 'Ocurrió un error',
                success: false
            });
        }
    },

    async deleteCategoriaMaquina(req, res){
        try {
           await CategoriaMaquinaModel.findByIdAndDelete(req.params.id);
           res.json({
               success: true,
               message: 'Categoría eliminada'
           });
        } catch (error) {
            res.json({
                message: 'Ocurrió un error',
                success: false
            });
        }
    },

    async createCategoriaMaquina(req, res){
        try {
            const {nombre} = req.body;
            if(!nombre){
                return res.json({
                    success: false,
                    message: 'El nombre no puede estar vacío'
                });
            }
            const respuesta = await CategoriaMaquinaModel.find({nombre: nombre});
            if(respuesta.length > 0){
                return res.json({
                    success: false,
                    message: 'Ya existe la categoría'
                });
            }
            
            const newCategoria = new CategoriaMaquinaModel({
                nombre
            });

            await newCategoria.save();

            res.json({
                success: true,
                message: 'Categoría creada correctamente'
            });

        } catch (error) {
            res.json({
                message: 'Ocurrió un error',
                success: false
            });
        }
    }
}