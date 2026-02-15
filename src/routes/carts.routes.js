const { Router } = require('express');
const { getCartById, addProductToCart, purchaseCart } = require('../controllers/carts.controller');
const { passportCall, authorization } = require('../middlewares/auth.middleware');

const router = Router();

router.get('/:cid', passportCall('current'), getCartById);
router.post('/:cid/product/:pid', passportCall('current'), authorization('user'), addProductToCart);
router.post('/:cid/purchase', passportCall('current'), authorization('user'), purchaseCart);

module.exports = router;
