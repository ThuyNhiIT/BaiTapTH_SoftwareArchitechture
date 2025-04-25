const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/orderController');

router.post('/create', OrderController.createOrder);
router.get('/status/:orderId', OrderController.getOrderStatus);

module.exports = router;