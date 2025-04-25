const Order = require('../models/Invoice');
const CircuitBreaker = require('opossum');

const breakerOptions = {
    timeout: 3000,
    errorThresholdPercentage: 50,
    resetTimeout: 10000
};

const createOrder = async (req) => {
    const { userId, products, totalAmount } = req.body;
    if (!userId || !products || !totalAmount) {
        throw new Error('Invalid order data');
    }
    const orderId = `ORD-${Date.now()}`;
    const order = new Order({ orderId, userId, products, totalAmount });
    await order.save();
    return { orderId, status: order.status, message: `Order created: ${orderId}` };
};

const breaker = new CircuitBreaker(createOrder, breakerOptions);

class OrderController {
    static async createOrder(req, res) {
        try {
            const result = await breaker.fire(req);
            res.json(result);
        } catch (err) {
            res.status(500).json({ message: 'Order service unavailable: ' + err.message });
        }
    }

    static async getOrderStatus(req, res) {
        const { orderId } = req.params;
        try {
            const order = await Order.findOne({ orderId });
            if (!order) {
                return res.status(404).json({ message: 'Order not found' });
            }
            res.json({ orderId, status: order.status, totalAmount: order.totalAmount });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
}

module.exports = OrderController;