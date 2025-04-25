const express = require('express');
const router = express.Router();
const ShippingController = require('../controllers/ShippingController');

router.post('/update', ShippingController.updateShipping);
router.get('/status/:orderId', ShippingController.getShippingStatus);

module.exports = router;