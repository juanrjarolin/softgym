const ventaController = {};
const moment = require('moment');
moment.locale('es');

const VentaModel = require('../models/Venta'); //modelo de ventas
const ProductModel = require('../models/Product'); //modelo de productos
const DetalleVentaModel = require('../models/DetalleVenta'); //modelo de detalle venta

ventaController.getVentas = async(req, res) => {
    try {
        const ventas = await VentaModel.find();
        res.json(ventas);
    } catch (error) {
        res.json({
            success: false,
            message: "Ha ocurrido un error"
        });
    }
}

ventaController.getVenta = async(req, res) => {
    try {
        const venta = await VentaModel.findById(req.params.id);
        res.json(venta);
    } catch (error) {
        res.json({
            success: false,
            message: "Ha ocurrido un error"
        });
    }
}

ventaController.createVenta = async(req, res) => {   
    const { cliente, tipo_venta, cantidad, producto} = req.body;

    if(!producto){
        return res.json({
            success: false,
            message: "El monto total no puede estar vacío"
        });
    }

    if (!cliente) {
        return res.json({
            success: false,
            message: "Debe seleccionar el cliente"
        });
    }

    if (!tipo_venta) {
        return res.json({
            success: false,
            message: "Debe seleccionar el tipo de venta"
        });
    }

    if (!cantidad) {
        return res.json({
            success: false,
            message: "Debe ingresar la cantidad"
        });
    }

    try {
        const num_factura = 12345; //generar
        const fecha = moment().format('L');
        const productVenta = await ProductModel.findOne({_id: producto});
        const monto_total = cantidad*productVenta.precio;
        const newVenta = new VentaModel({
            num_factura,
            fecha,
            monto_total,
            cliente,
            tipo_venta
        });

        const venta = await newVenta.save();
        const detalleVenta = new DetalleVentaModel({
            producto: producto,
            venta: venta._id,
            cantidad: cantidad,
            precio: productVenta.precio
        });

        await detalleVenta.save();

        res.json({
            success: true,
            message: "Venta registrada"
        });

    } catch (error) {
        res.json({
            success: false,
            message: "Ha ocurrido un error"
        });
    }
}

ventaController.updateVenta = async(req, res) => {
    try {
        const { cliente, tipo_venta, cantidad, producto} = req.body;

        const productVenta = await ProductModel.findOne({_id: producto});
        const monto_total = cantidad*productVenta.precio;
        const newVenta = {
            monto_total,
            cliente,
            tipo_venta
        };

        await VentaModel.findByIdAndUpdate({_id: req.params.id}, newVenta);

        const detalleVenta = {
            producto: producto,
            venta: req.params.id,
            cantidad: cantidad,
            precio: productVenta.precio
        };

        const detalleV = await DetalleVentaModel.findOne({venta: req.params.id});
        await DetalleVentaModel.findByIdAndUpdate({_id: detalleV._id}, detalleVenta);

        res.json({
            success: true,
            message: "Venta actualizada"
        });
    } catch (error) {
        res.json({
            success: false,
            message: "Ha ocurrido un error"
        });
    }
}

ventaController.deleteVenta = async(req, res) => {
    try {
        const detalleV = await DetalleVentaModel.findOne({venta: req.params.id});
        await DetalleVentaModel.findByIdAndDelete(detalleV._id);
        await VentaModel.findByIdAndDelete(req.params.id);
        res.json({
            success: true,
            message: "Venta eliminada"
        });
    } catch (error) {
        res.json({
            success: false,
            message: "Ha ocurrido un error"
        });
    }
}

module.exports = ventaController;