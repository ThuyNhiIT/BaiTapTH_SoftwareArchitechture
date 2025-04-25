const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

// Load environment variables
dotenv.config();

// MongoDB connection URL
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/product_db';

// Dữ liệu mẫu cho sản phẩm
const sampleProducts = [
  { productId: 'PROD001', productName: 'Adidas Ultra Boost', sellingPrice: 100.0, discount: 10.0 },
  { productId: 'PROD002', productName: 'Nike Air Max', sellingPrice: 120.0, discount: 15.0 },
  { productId: 'PROD003', productName: 'Puma Running Shoes', sellingPrice: 80.0, discount: 5.0 },
  { productId: 'PROD004', productName: 'Reebok Classic', sellingPrice: 90.0, discount: 0.0 },
  { productId: 'PROD005', productName: 'New Balance Fresh Foam', sellingPrice: 110.0, discount: 20.0 },
  { productId: 'PROD006', productName: 'Asics Gel-Kayano', sellingPrice: 130.0, discount: 10.0 },
  { productId: 'PROD007', productName: 'Under Armour HOVR', sellingPrice: 95.0, discount: 8.0 },
  { productId: 'PROD008', productName: 'Vans Old Skool', sellingPrice: 60.0, discount: 0.0 },
  { productId: 'PROD009', productName: 'Converse Chuck Taylor', sellingPrice: 70.0, discount: 5.0 },
  { productId: 'PROD010', productName: 'Saucony Shadow', sellingPrice: 85.0, discount: 12.0 },
];

// Hàm kết nối MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('ProductService: MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Hàm seed dữ liệu sản phẩm
const seedProducts = async () => {
  try {
    // Xóa dữ liệu cũ
    await Product.deleteMany({});
    console.log('Cleared old product data');

    // Thêm dữ liệu mẫu
    await Product.insertMany(sampleProducts);
    console.log('Seeded product data');
  } catch (error) {
    console.error('Error seeding products:', error);
    throw error;
  }
};

// Hàm chính để seed dữ liệu
const seedData = async () => {
  try {
    // Kết nối MongoDB
    await connectDB();

    // Seed dữ liệu
    await seedProducts();

    console.log('ProductService: Data seeded successfully');
  } catch (error) {
    console.error('ProductService: Seeding failed:', error);
  } finally {
    // Đóng kết nối
    await mongoose.connection.close();
    console.log('ProductService: MongoDB connection closed');
    process.exit(0);
  }
};

// Chạy hàm seed
seedData();