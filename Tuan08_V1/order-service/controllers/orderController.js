const axios = require('axios');
const Invoice = require('../models/Invoice');

const getAllInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find({});
    res.status(200).json(invoices);
  } catch (error) {
    console.error('Error fetching invoices:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


const createInvoice = async (req, res) => {
  const { customerId, issueDate, invoiceDetails } = req.body;

  // Kiểm tra các field bắt buộc
  if (!customerId || !issueDate || !invoiceDetails || !Array.isArray(invoiceDetails)) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    // Lấy thông tin sản phẩm từ API Gateway
    const products = await Promise.all(
      invoiceDetails.map(async (detail) => {
        try {
          const response = await axios.get(`${process.env.API_GATEWAY_URL}/products/${detail.productId}`);
          return {
            productId: detail.productId,
            quantity: detail.quantity,
            product: response.data,
          };
        } catch (error) {
          throw new Error(`Product ${detail.productId} not found`);
        }
      })
    );

    // Tính tổng tiền
    const total = products.reduce((sum, item) => {
      const price = item.product.sellingPrice * (1 - item.product.discount / 100);
      return sum + price * item.quantity;
    }, 0);

    // Tạo invoiceId tự động (ví dụ: INV-timestamp)
    const invoiceId = `INV-${Date.now()}`;

    // Tạo hóa đơn
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
    res.status(201).json({ message: 'Invoice created', invoice });
  } catch (error) {
    console.error('Error creating invoice:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getAllInvoices,
  createInvoice,
};