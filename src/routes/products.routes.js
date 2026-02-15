const { Router } = require('express');
const {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct
} = require('../controllers/products.controller');
const { passportCall, authorization } = require('../middlewares/auth.middleware');

const router = Router();

router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', passportCall('current'), authorization('admin'), createProduct);
router.put('/:id', passportCall('current'), authorization('admin'), updateProduct);
router.delete('/:id', passportCall('current'), authorization('admin'), deleteProduct);

module.exports = router;
