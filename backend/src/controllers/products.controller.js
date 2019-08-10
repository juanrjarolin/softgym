const productController = {};

const ProductModel = require('../models/Product');
//const {Schema, model} = require('mongoose');

//const pr

productController.createProduct = async (req, res) =>{
    const {name,price,cost,stockMinimo} = req.body; //

    if(!name){
        return res.json({
            success: false,
            message: 'El nombre no puede estar vacío'
        });
    }
    
    if(!price){
        return res.json({
            success: false,
            messagge:'El precio debe ser ingresado'
        });
    }
    if(!cost){
        return res.json({
            success: false,
            messagge: 'El costo debe ser ingresado'
        });
    }
    if(!stockMinimo){
        return res.json({
            success :false,
            messagge: 'El stock minimo debe ser ingresado'
        });
    }
     
    //const product = await ProductModel.findById;//ver 
    const newProduct = new ProductModel({
        name,
        price,
        cost,
        stockMinimo
    });

    await newProduct.save((err,product) => {
        if (product){
            res.json({
                success: true,
                messagge: 'Yes'
            })
        }else{
            res.json({
                success: false,
                messagge: 'Vaya!'
            })
        }
    });
};

productController.deleteProduct = async (req, res) =>{
    const productDel =  await ProductModel.findByIdAndDelete(req.params.id);
    //await ProductModel.findByIdAndDelete(req.params.id);
    return res.json({
        success: true,
        messagge: 'Producto eliminado exitosamente',
        data: productDel.name
    });
};

productController.getProduct = async (req, res) =>{
    const product = await ProductModel.findById(req.params.id);
    res.json(product);
};

productController.getProducts = async(req,res) =>{
    const products = await ProductModel.find();
    res.json(products);
}

module.exports = productController;