const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.post('/', orderController.createInvoice);
router.get('/', orderController.getAllInvoices);

module.exports = router;