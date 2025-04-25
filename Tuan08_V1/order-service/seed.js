const mongoose = require('mongoose');
const axios = require('axios');
const dotenv = require('dotenv');
const Invoice = require('./models/Invoice');

// Load environment variables
dotenv.config();

// MongoDB connection URL và API Gateway
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/order_db';
const API_GATEWAY_URL = process.env.API_GATEWAY_URL || 'http://localhost:3003';

// Danh sách productId từ ProductService
const productIds = [
  'PROD001', 'PROD002', 'PROD003', 'PROD004', 'PROD005',
  'PROD006', 'PROD007', 'PROD008', 'PROD009', 'PROD010'
];

// Hàm kết nối MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('OrderService: MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Hàm tạo invoiceDetails ngẫu nhiên
const generateRandomInvoiceDetails = (count) => {
  const details = [];
  const selectedIndices = new Set();

  // Chọn ngẫu nhiên 1-3 sản phẩm
  while (selectedIndices.size < count) {
    const index = Math.floor(Math.random() * productIds.length);
    selectedIndices.add(index);
  }

  selectedIndices.forEach((index) => {
    details.push({
      productId: productIds[index],
      quantity: Math.floor(Math.random() * 3) + 1, // Số lượng từ 1-3
    });
  });

  return details;
};

// Hàm seed dữ liệu hóa đơn
const seedInvoices = async () => {
  try {
    // Xóa dữ liệu cũ
    await Invoice.deleteMany({});
    console.log('Cleared old invoice data');

    // Lấy thông tin sản phẩm từ API Gateway
    const products = await Promise.all(
      productIds.map(async (productId) => {
        try {
          const response = await axios.get(`${API_GATEWAY_URL}/products/${productId}`);
          return response.data;
        } catch (error) {
          console.error(`Error fetching product ${productId}:`, error.message);
          return null;
        }
      })
    );

    // Lọc sản phẩm hợp lệ
    const validProducts = products.filter((p) => p !== null);

    // Tạo 5 hóa đơn mẫu
    const invoices = [];
    for (let i = 1; i <= 5; i++) {
      const invoiceDetails = generateRandomInvoiceDetails(Math.floor(Math.random() * 3) + 1);

      // Tính tổng tiền
      const total = invoiceDetails.reduce((sum, detail) => {
        const product = validProducts.find((p) => p.productId === detail.productId);
        if (!product) return sum;
        const price = product.sellingPrice * (1 - product.discount / 100);
        return sum + price * detail.quantity;
      }, 0);

      invoices.push({
        invoiceId: `INV-${1000 + i}`,
        customerId: `CUST${Math.floor(Math.random() * 100)}`,
        issueDate: new Date(`2025-04-${20 + i}`),
        total,
        invoiceDetails,
      });
    }

    // Thêm dữ liệu hóa đơn
    await Invoice.insertMany(invoices);
    console.log('Seeded invoice data');
  } catch (error) {
    console.error('Error seeding invoices:', error);
    throw error;
  }
};

// Hàm chính để seed dữ liệu
const seedData = async () => {
  try {
    // Kết nối MongoDB
    await connectDB();

    // Seed dữ liệu
    await seedInvoices();

    console.log('OrderService: Data seeded successfully');
  } catch (error) {
    console.error('OrderService: Seeding failed:', error);
  } finally {
    // Đóng kết nối
    await mongoose.connection.close();
    console.log('OrderService: MongoDB connection closed');
    process.exit(0);
  }
};

// Chạy hàm seed
seedData();