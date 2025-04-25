const Product = require('../models/Product');
const CircuitBreaker = require('opossum');

const breakerOptions = {
    timeout: 3000,
    errorThresholdPercentage: 50,
    resetTimeout: 10000
};

// Create Product
const createProduct = async (req) => {
    const { name, price, description, quantity } = req.body;
    if (!name || !price || quantity < 0) {
        throw new Error('Invalid product data');
    }
    const productId = `PROD-${Date.now()}`;
    const product = new Product({ productId, name, price, description, quantity });
    await product.save();
    return { productId, name, price, quantity, message: `Product created: ${productId}` };
};

// Update Inventory
const updateInventory = async (req) => {
    const { productId, quantity } = req.body;
    if (!productId || quantity <= 0) {
        throw new Error('Invalid productId or quantity');
    }
    const product = await Product.findOne({ productId });
    if (!product || product.quantity < quantity) {
        throw new Error('Insufficient stock');
    }
    product.quantity -= quantity;
    product.updatedAt = new Date();
    await product.save();
    return { productId, remainingQuantity: product.quantity, message: `Inventory updated for product: ${productId}` };
};

const createBreaker = new CircuitBreaker(createProduct, breakerOptions);
const updateBreaker = new CircuitBreaker(updateInventory, breakerOptions);

class ProductInventoryController {
    static async createProduct(req, res) {
        try {
            const result = await createBreaker.fire(req);
            res.json(result);
        } catch (err) {
            res.status(500).json({ message: 'Product service unavailable: ' + err.message });
        }
    }

    static async getProduct(req, res) {
        const { productId } = req.params;
        try {
            const product = await Product.findOne({ productId });
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }
            res.json({ productId, name: product.name, price: product.price, quantity: product.quantity });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    static async updateInventory(req, res) {
        try {
            const result = await updateBreaker.fire(req);
            res.json(result);
        } catch (err) {
            res.status(500).json({ message: 'Inventory service unavailable: ' + err.message });
        }
    }

    static async getInventoryStatus(req, res) {
        const { productId } = req.params;
        try {
            const product = await Product.findOne({ productId });
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }
            res.json({ productId, quantity: product.quantity });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
}

module.exports = ProductInventoryController;