// Nhập mô hình Order và thư viện CircuitBreaker
const Order = require('../models/Invoice');
const CircuitBreaker = require('opossum');

// Cấu hình CircuitBreaker
const breakerOptions = {
    timeout: 3000,
    errorThresholdPercentage: 50, // là 50% số yêu cầu thất bại trước khi mở lại
    resetTimeout: 5000,
    rollingCount: 4 // Theo dõi 3 kết quả gần nhất
};

// Tạo đơn hàng
const createOrder = async (req) => {
    const { userId, products, totalAmount } = req.body;
    if (!userId || !products || !totalAmount) {
        throw new Error('Dữ liệu đơn hàng không hợp lệ');
    }
    const orderId = `ORD-${Date.now()}`;
    const order = new Order({ orderId, userId, products, totalAmount, status: 'PENDING' });
    await order.save();
    return {
        orderId,
        status: order.status,
        message: `Tạo đơn hàng thành công: ${orderId}`
    };
};

// Hàm dự phòng khi CircuitBreaker ở trạng thái Open
const createOrderFallback = () => {
    return { message: 'Dịch vụ đơn hàng tạm thời không khả dụng. Vui lòng thử lại sau.' };
};

// Tạo CircuitBreaker cho hàm createOrder
const createBreaker = new CircuitBreaker(createOrder, breakerOptions);

// Gán hàm dự phòng
createBreaker.fallback(createOrderFallback);

// Theo dõi trạng thái CircuitBreaker
createBreaker.on('open', () => {
    console.log('Circuit Breaker (Tạo đơn hàng): MỞ - Dịch vụ đơn hàng không khả dụng');
});
createBreaker.on('halfOpen', () => {
    console.log('Circuit Breaker (Tạo đơn hàng): NỬA MỞ - Đang kiểm tra dịch vụ đơn hàng');
});
createBreaker.on('close', () => {
    console.log('Circuit Breaker (Tạo đơn hàng): ĐÓNG - Dịch vụ đơn hàng hoạt động bình thường');
});
createBreaker.on('success', () => {
    console.log('Circuit Breaker (Tạo đơn hàng): Yêu cầu thành công');
});
createBreaker.on('failure', (err) => {
    console.log(`Circuit Breaker (Tạo đơn hàng): Yêu cầu thất bại - ${err.message}`);
});

// Hàm xử lý yêu cầu tạo đơn hàng
const createOrderHandler = async (req, res) => {
    try {
        const result = await createBreaker.fire(req);
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ message: 'Lỗi máy chủ', error: err.message });
    }
};

// Hàm lấy trạng thái đơn hàng
const getOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await Order.findOne({ orderId });
        if (!order) {
            return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
        }
        res.status(200).json({
            orderId,
            status: order.status,
            totalAmount: order.totalAmount
        });
    } catch (err) {
        res.status(500).json({ message: 'Lỗi máy chủ', error: err.message });
    }
};

// Xuất các hàm
module.exports = {
    createOrder: createOrderHandler,
    getOrderStatus
};