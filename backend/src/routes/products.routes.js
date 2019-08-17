const {Router} = require('express');
const router = Router();

const {getProduct, getProducts, createProduct, deleteProduct, updateProduct} = require('../controllers/products.controller');

//API REST PRODUCTS
router.get('/', getProducts);
router.get('/:id', getProduct);
router.post('/', createProduct);
router.delete('/:id', deleteProduct);
router.put('/:id', updateProduct);

module.exports= router;