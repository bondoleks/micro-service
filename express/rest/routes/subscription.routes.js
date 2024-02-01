const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/subscription.controller');
const authenticateToken = require('../middleware/authenticateToken');

router.get('/subscriptions', subscriptionController.getAvailableSubscriptions);
router.post(
    '/subscriptions',
    authenticateToken,
    subscriptionController.chooseSubscription
);

module.exports = router;
