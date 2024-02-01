const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authenticateToken = require('../middleware/authenticateToken');

router.get(
    '/user/subscriptions',
    authenticateToken,
    userController.getUserSubscriptions
);
router.get(
    '/user/buy/products',
    authenticateToken,
    userController.getUserBuyProducts
);
router.get(
    '/user/sell/products',
    authenticateToken,
    userController.getUserSellProducts
);

module.exports = router;
