const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const authenticateToken = require('../middleware/authenticateToken');
const upload = require('../middleware/upload');

router.get(
    '/products',
    authenticateToken,
    productController.getProductsBySubscriptionType
);
router.get('/product', authenticateToken, productController.getProduct);
router.post('/product', authenticateToken, productController.createProduct);
router.post(
    '/productWithPhoto',
    authenticateToken,
    upload.single('photo'),
    productController.createProductWithPhoto
);
router.put(
    '/purchase/product',
    authenticateToken,
    productController.purchaseProduct
);

module.exports = router;
