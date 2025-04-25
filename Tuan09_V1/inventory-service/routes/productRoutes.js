const express = require('express');
const router = express.Router();
const ProductInventoryController = require('../controllers/productController');

router.post('/create', ProductInventoryController.createProduct);
router.get('/:productId', ProductInventoryController.getProduct);
router.post('/inventory/update', ProductInventoryController.updateInventory);
router.get('/inventory/status/:productId', ProductInventoryController.getInventoryStatus);

module.exports = router;