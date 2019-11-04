const reservaController = {};

const ReservaModel = require('../models/Reserva');
const ClaseModel = require('../models/Clase');
const moment = require('moment');
moment.locale('es');

reservaController.getReservas = async (req, res) => {
    try {
        const reservas = await ReservaModel.find();
        res.json(reservas);
    } catch (error) {
        console.log(error);
    }
};

reservaController.getReserva = async (req, res) => {
    try {
        const reserva = await ReservaModel.findById(req.params.id);
        res.json(reserva);
    } catch (error) {
        console.log(error);
    }
};

reservaController.createReserva = async (req, res) => {
    const { cliente, clase, sucursal } = req.body;

    if (!cliente) {
        return res.json({
            success: false,
            message: 'Debe agregarse un cliente'
        });
    }

    if (!clase) {
        return res.json({
            success: false,
            message: 'Debe agregarse una clase'
        });
    }

    if (!sucursal) {
        return res.json({
            success: false,
            message: 'Debe agregarse una sucursal'
        });
    }

    try {
        const fechaActual = moment().format('L');
        const result = await ReservaModel.find({cliente: cliente, clase: clase})
            .where('fechaReserva').equals(fechaActual);
        if (result.length > 0) {
            return res.json({
                success: false,
                message: 'Ya existe la clase reservada en la fecha actual'
            });
        } else {
            const result = await ClaseModel.findById(clase);
            result.cantidadActual = result.cantidadActual + 1;
            await result.save()

            const fechaReserva = moment().format('L');

            const newReserva = new ReservaModel({
                cliente,
                clase,
                sucursal,
                fechaReserva
            });

            await newReserva.save();
            return res.json({
                success: true,
                message: 'Reserva creada'
            });
        }
        
    } catch (error) {
        console.log(error);
        return res.json({
            success: false,
            message: 'Ha ocurrido un error'
        });
    }
};

reservaController.updateReserva = async (req, res) => {
    try {
        await ReservaModel.findByIdAndUpdate({ _id: req.params.id }, req.body);
        res.json({
            success: true,
            message: 'Reserva actualizada correctamente'
        });
    } catch (error) {
        res.json({
            success: false,
            message: 'No se pudo actualizar la reserva'
        });
    }
};

reservaController.deleteReserva = async (req, res) => {
    try {

        const result = await Promise.all([
            await ReservaModel.findOne().where('clase').equals(req.params.id),
            await ClaseModel.findById(req.params.id)
        ]);

        if(result[1].cantidadActual > 0){
            if(result[1].cantidadActual === result[1].cantidadPersona){
                result[1].cantidadActual = result[1].cantidadActual - 1;
                result[1].estado = "Disponible";
                await result[1].save();
            }else{
                result[1].cantidadActual = result[1].cantidadActual - 1;
                await result[1].save();
            }
        }

        await ReservaModel.findByIdAndDelete(result[0]._id);
        res.json({
            success: true,
            message: 'Reserva eliminada correctamente'
        });
    } catch (error) {
        res.json({
            success: false,
            message: 'No se pudo eliminar la reserva'
        });
    }
};


module.exports = reservaController;