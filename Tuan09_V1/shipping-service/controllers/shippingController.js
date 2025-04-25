const Shipment = require('../models/Shipment');
const CircuitBreaker = require('opossum');

const breakerOptions = {
    timeout: 3000,
    errorThresholdPercentage: 50,
    resetTimeout: 10000
};

const updateShipping = async (req) => {
    const { orderId, status } = req.body;
    if (!orderId || !['PENDING', 'SHIPPED', 'DELIVERED'].includes(status)) {
        throw new Error('Invalid orderId or status');
    }
    let shipment = await Shipment.findOne({ orderId });
    if (!shipment) {
        shipment = new Shipment({ orderId, status });
    } else {
        shipment.status = status;
        shipment.updatedAt = new Date();
    }
    await shipment.save();
    return { orderId, status, message: `Shipping status updated for order: ${orderId}` };
};

const breaker = new CircuitBreaker(updateShipping, breakerOptions);

class ShippingController {
    static async updateShipping(req, res) {
        try {
            const result = await breaker.fire(req);
            res.json(result);
        } catch (err) {
            res.status(500).json({ message: 'Shipping service unavailable: ' + err.message });
        }
    }

    static async getShippingStatus(req, res) {
        const { orderId } = req.params;
        try {
            const shipment = await Shipment.findOne({ orderId });
            if (!shipment) {
                return res.status(404).json({ message: 'Shipment not found' });
            }
            res.json({ orderId, status: shipment.status });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
}

module.exports = ShippingController;