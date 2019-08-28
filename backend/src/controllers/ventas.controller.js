const ventaController = {};

ventaController.getVentas = (req, res) => {
    res.json({message: 'Muestra ventas'});
}

ventaController.getVenta = (req, res) => {
    res.json({message: 'Muestra una venta'});
}

ventaController.createVenta = (req, res) => {
    res.json({message: 'Crea venta'});
}

ventaController.updateVenta = (req, res) => {
    res.json({message: 'Actualiza venta'});
}

ventaController.deleteVenta = (req, res) => {
    res.json({message: 'Elimina una venta'});
}

module.exports = ventaController;