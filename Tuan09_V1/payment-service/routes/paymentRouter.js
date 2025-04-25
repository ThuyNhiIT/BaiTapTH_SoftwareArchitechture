const express = require('express');
const router = express.Router();
const PaymentController = require('../controllers/paymentController');

router.post('/process', PaymentController.processPayment);
router.post('/refund/:orderId', PaymentController.refundPayment);
router.get('/status/:orderId', PaymentController.getPaymentStatus);

module.exports = router;