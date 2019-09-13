const {Router} = require('express');
const router = Router();
const DetalleVentasModel = require('../models/DetalleVenta');

router.get('/', async(req, res) => {
    try {
        const detalleVentas = await DetalleVentasModel.find();
        res.json(detalleVentas);
    } catch (error) {
        res.json({
            success: false,
            message: "Error"
        });
    }
});

router.get('/:id', async(req, res) => {
    try {
        const detalleVenta = await DetalleVentasModel.findById(req.params.id);
        res.json(detalleVenta);
    } catch (error) {
        res.json({
            success: false,
            message: "Error"
        });
    }
});

module.exports = router;