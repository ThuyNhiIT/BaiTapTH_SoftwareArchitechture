// Nhập thư viện Express và OrderController
const express = require('express');
const router = express.Router();
const { createOrder, getOrderStatus } = require('../controllers/orderController');

// Định nghĩa các route
router.post('/create', createOrder); // Route để tạo đơn hàng
router.get('/status/:orderId', getOrderStatus); // Route để lấy trạng thái đơn hàng

// Xuất router
module.exports = router;