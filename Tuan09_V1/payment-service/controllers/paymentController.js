const Payment = require('../models/Payment');
const CircuitBreaker = require('opossum');

const breakerOptions = {
    timeout: 3000, // Thời gian chờ tối đa cho mỗi yêu cầu (3 giây)
    errorThresholdPercentage: 50, // Chuyển sang Open nếu 50% yêu cầu thất bại
    resetTimeout: 10000, // Chờ 10 giây trước khi chuyển từ Open sang Half-Open
    rollingCountTimeout: 30000, // Thu thập thống kê lỗi trong 30 giây
    rollingCountBuckets: 10, // Chia 30 giây thành 10 bucket (mỗi bucket 3 giây)
    errorFilter: (err) => {
        // Bỏ qua lỗi 400 (Bad Request) để không tính vào tỷ lệ lỗi
        return err.message.includes('Invalid') || err.message.includes('No valid payment');
    }
};

// Retry mechanism
const retry = async (fn, retries = 3, delay = 1000) => {
    for (let i = 0; i < retries; i++) {
        try {
            return await fn();
        } catch (err) {
            if (i === retries - 1) throw err;
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
};

// Time Limiter
const timeLimit = (fn, timeout) => {
    return new Promise((resolve, reject) => {
        const timer = setTimeout(() => reject(new Error('Operation timed out')), timeout);
        fn().then(result => {
            clearTimeout(timer);
            resolve(result);
        }).catch(err => {
            clearTimeout(timer);
            reject(err);
        });
    });
};

// Xử lý thanh toán
const processPayment = async (req) => {
    const { orderId, amount } = req.body;
    if (!orderId || amount <= 0) {
        throw new Error('Invalid orderId or amount');
    }
    let payment = await Payment.findOne({ orderId });
    if (payment) {
        throw new Error('Payment already exists for this order');
    }
    payment = new Payment({ orderId, amount, status: 'PAID' });
    await payment.save();
    return { orderId, status: 'PAID', message: `Payment processed for order: ${orderId}` };
};

// Fallback khi Circuit Breaker ở trạng thái Open
const fallback = (req) => {
    return { message: 'Payment service temporarily unavailable. Please try again later.' };
};

const breaker = new CircuitBreaker(processPayment, breakerOptions);
breaker.fallback(fallback);

// Theo dõi trạng thái Circuit Breaker
breaker.on('open', () => {
    console.log('Circuit Breaker: OPEN - Payment service is unavailable');
});
breaker.on('halfOpen', () => {
    console.log('Circuit Breaker: HALF-OPEN - Testing Payment service');
});
breaker.on('close', () => {
    console.log('Circuit Breaker: CLOSED - Payment service is operational');
});
breaker.on('success', () => {
    console.log('Circuit Breaker: Request succeeded');
});
breaker.on('failure', (err) => {
    console.log(`Circuit Breaker: Request failed - ${err.message}`);
});

class PaymentController {
    static async processPayment(req, res) {
        try {
            const result = await retry(() => timeLimit(() => breaker.fire(req), 5000));
            res.json(result);
        } catch (err) {
            res.status(500).json({ message: 'Payment service unavailable: ' + err.message });
        }
    }

    static async refundPayment(req, res) {
        const { orderId } = req.params;
        try {
            const payment = await Payment.findOne({ orderId });
            if (!payment || payment.status !== 'PAID') {
                throw new Error('No valid payment found for refund');
            }
            payment.status = 'REFUNDED';
            await payment.save();
            res.json({ orderId, status: 'REFUNDED', message: `Refund processed for order: ${orderId}` });
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    }

    static async getPaymentStatus(req, res) {
        const { orderId } = req.params;
        try {
            const payment = await Payment.findOne({ orderId });
            if (!payment) {
                return res.status(404).json({ message: 'Payment not found' });
            }
            res.json({ orderId, status: payment.status, amount: payment.amount });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
}

module.exports = PaymentController;