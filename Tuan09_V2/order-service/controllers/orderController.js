const axios = require('axios');
const Invoice = require('../models/Invoice');
const CircuitBreaker = require('./CircuitBreaker');

// Khởi tạo mạch ngắt cho API
const productApiCircuitBreaker = new CircuitBreaker({
  failureThreshold: 3,
  retryCount: 3,
  resetTimeout: 10000, // 10 giây để reset mạch ngắt
});

const getProductData = async (productId, retryCount = 0) => {
  // Kiểm tra trạng thái CircuitBreaker chỉ ở lần đầu tiên
  if (retryCount === 0 && productApiCircuitBreaker.isOpen()) {
    console.log('Circuit is open, skipping request.');
    throw new Error('Circuit is open, request failed.');
  }

  try {
    console.log(`Fetching product ${productId}, attempt ${retryCount + 1}`);
    const response = await axios.get(`${process.env.API_GATEWAY_URL}/products/${productId}`);
    if (retryCount === 0) {
      productApiCircuitBreaker.success(); // Chỉ gọi success() ở lần đầu tiên
    }
    console.log('Product fetched successfully:', productId);
    return response.data;
  } catch (error) {
    if (retryCount === 0) {
      productApiCircuitBreaker.fail(); // Chỉ gọi fail() ở lần đầu tiên
    }
    if (retryCount < productApiCircuitBreaker.retryCount) {
      console.log(`Retrying... Attempt ${retryCount + 1} for product ${productId}`);
      return await getProductData(productId, retryCount + 1);
    }
    console.log(`Failed to fetch product ${productId} after ${productApiCircuitBreaker.retryCount} retries`);
    throw new Error(`Product ${productId} not found after ${productApiCircuitBreaker.retryCount} retries`);
  }
};

const createInvoice = async (req, res) => {
  const { customerId, issueDate, invoiceDetails } = req.body;

  if (!customerId || !issueDate || !invoiceDetails || !Array.isArray(invoiceDetails)) {
    console.log('Request failed: Missing required fields');
    console.log(`Circuit state after request: ${productApiCircuitBreaker.getStatus()}`);
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    console.log(`Creating invoice with body:`, req.body);
    const products = await Promise.all(
      invoiceDetails.map(async (detail) => {
        const product = await getProductData(detail.productId);
        console.log(`Product ${detail.productId} fetched for invoice:`, product);
        return {
          productId: detail.productId,
          quantity: detail.quantity,
          product,
        };
      })
    );

    // Tính tổng tiền
    const total = products.reduce((sum, item) => {
      const price = item.product.sellingPrice * (1 - item.product.discount / 100);
      return sum + price * item.quantity;
    }, 0);

    const invoiceId = `INV-${Date.now()}`;
    const invoice = new Invoice({
      invoiceId,
      customerId,
      issueDate,
      total,
      invoiceDetails: products.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
    });

    await invoice.save();
    console.log('Invoice created successfully:', invoice);
    console.log(`Circuit state after request: ${productApiCircuitBreaker.getStatus()}`);
    res.status(201).json({ message: 'Invoice created', invoice });
  } catch (error) {
    console.error('Error creating invoice:', error.message);
    console.log(`Circuit state after request: ${productApiCircuitBreaker.getStatus()}`);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createInvoice,
};