const {Router} = require('express');
const router = Router();

const {getProduct,getProducts,createProduct} = require('../controllers/products.controller');

router.get('/', getProducts);
router.get('/:id', getProduct);
router.post('/',createProduct);


module.exports= router;