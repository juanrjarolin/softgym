const DetalleModel = require('../models/Mantenimiento/DetalleMantenimiento');
const MantenimientoModel = require('../models/Mantenimiento/Mantenimiento');
const MaquinaModel = require('../models/Maquina');

module.exports = {
    async allDetalles(req, res){
        try {
            const detalles = await DetalleModel.find();
            res.json(detalles);
        } catch (error) {
            res.json({
                success: false,
                message: 'No se pudo obtener los detalles'
            })
        }
    },

    async getDetalles(req, res){
        try {
            const detalles = await DetalleModel.find().where('mantenimiento').equals(req.params.id);
            res.json(detalles);
        } catch (error) {
            res.json({
                success: false,
                message: 'Ocurrió un error'
            })
        }
    },

    async createDetalle(req, res){
        const {mantenimiento, maquina, costo, detalle} = req.body;

        if(!maquina){
            return res.json({
                success: false,
                message: 'Debe agregar una maquina'
            });
        }

        if(!mantenimiento){
            return res.json({
                success: false,
                message: 'Debe proporcionar una cabecera de mantenimiento'
            });
        }

        if(!costo){
            return res.json({
                success: false,
                message: 'Debe agregar un costo'
            });
        }

        if(!detalle){
            return res.json({
                success: false,
                message: 'Debe agregar un detalle'
            });
        }

        try {
            let cantidadPreventivo = 0;
            let cantidadCorrectivo = 0;

            const newDetalle = new DetalleModel({
                mantenimiento,
                maquina,
                costo,
                detalle
            });

            await newDetalle.save();

            //se actualizan algunos datos
            const mantenObject = await MantenimientoModel.findOne({_id: mantenimiento});
            const maquinaObject = await MaquinaModel.findOne({_id: maquina});

            //costos totales
            if(mantenObject.tipoMantenimiento === 'Preventivo'){
                maquinaObject.totalCostoMantenimiento = maquinaObject.totalCostoMantenimiento + parseInt(costo);
                maquinaObject.ultimoMantenimiento = mantenObject.fecha;
            }else{
                maquinaObject.totalCostoReparacion = maquinaObject.totalCostoReparacion + parseInt(costo);
                maquinaObject.ultimaReparacion = mantenObject.fecha;
            }

            const detalleObject = await DetalleModel.find().where('maquina').equals(maquina);
            detalleObject.forEach((detalle) => {
                if(detalle.mantenimiento.tipoMantenimiento === 'Preventivo'){
                    cantidadPreventivo = cantidadPreventivo + 1;
                }else{
                    cantidadCorrectivo = cantidadCorrectivo + 1;
                }
            });
            
            maquinaObject.cantMantenimiento = cantidadPreventivo;
            maquinaObject.cantReparacion = cantidadCorrectivo;
            
            await maquinaObject.save();
            
            res.json({
                success: true,
                message: 'Agregado'
            });
        } catch (error) {
            res.json({
                success: false,
                message: 'Ha ocurrido un error'
            })
        }
    },

    async deleteDetalle(req, res){
        try {
            await DetalleModel.findByIdAndDelete(req.params.id);
            res.json({
                success: true,
                message: 'Eliminado'
            });
        } catch (error) {
            res.json({
                success: false,
                message: 'No se pudo eliminar'
            })
        }
    },

    async getDetalle(req, res){
        try {
            const detalle = await DetalleModel.findById(req.params.id);
            res.json(detalle);
        } catch (error) {
            res.json({
                success: false,
                message: 'No se pudo obtener el detalle'
            })
        }
    },

    async updateDetalle(req, res){
        try {
            await DetalleModel.findByIdAndUpdate({_id: req.params.id}, req.body);
            res.json({
                success: true,
                message: 'Se ha actualizado el detalle'
            });
        } catch (error) {
            res.json({
                success: false,
                message: 'Ha ocurrido un error'
            });
        }
    }


}