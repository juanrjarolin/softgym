const productController = {};

const ProductModel = require('../models/Product');

productController.createProduct = async (req, res) => {
    const {nombre, precio, costo, stockMinimo} = req.body;

    if(!nombre){
        return res.json({
            success: false,
            message: 'El nombre no puede estar vacío'
        });
    }
    
    if(!precio){
        return res.json({
            success: false,
            message:'El precio debe ser ingresado'
        });
    }
    if(!costo){
        return res.json({
            success: false,
            message: 'El costo debe ser ingresado'
        });
    }
    if(!stockMinimo){
        return res.json({
            success: false,
            message: 'El stock minimo debe ser ingresado'
        });
    }
     
    const newProduct = new ProductModel({
        nombre,
        precio,
        costo,
        stockMinimo
    });

    await newProduct.save((err,product) => {
        if (product){
            res.json({
                success: true,
                message: 'Se ha insertado el producto correctamente'
            })
        }else{
            res.json({
                success: false,
                message: 'Ha ocurrido un error'
            })
        }
    });
};

productController.deleteProduct = async (req, res) => {
    await ProductModel.findByIdAndDelete(req.params.id);
    res.json({
        success: true,
        message: 'Producto eliminado exitosamente'
    });
};

productController.getProduct = async (req, res) => {
    const product = await ProductModel.findById(req.params.id);
    res.json(product);
};

productController.getProducts = async(req,res) => {
    const products = await ProductModel.find();
    res.json(products);
}

productController.updateProduct = async(req, res) => {
    await ProductModel.findByIdAndUpdate({_id: req.params.id}, req.body);
    res.json({
        success: true,
        message: 'Producto actualizado'
    });
}

module.exports = productController;