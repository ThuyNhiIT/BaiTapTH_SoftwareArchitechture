const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const productRoutes = require('./routes/productRoutes');

dotenv.config();
const app = express();

// Middleware parse JSON
app.use(express.json({ limit: '10mb' }));

// Log yêu cầu
app.use((req, res, next) => {
    console.log(`[Inventory-Service] Yêu cầu đến: ${req.method} ${req.originalUrl}`);
    console.log(`[Inventory-Service] Body:`, req.body);
    next();
});

// Kết nối MongoDB
connectDB();

// Routes
app.use('/api/products', productRoutes);

// Xử lý lỗi
app.use((err, req, res, next) => {
    console.error('[Inventory-Service] Lỗi:', err.message);
    res.status(500).json({ message: 'Lỗi máy chủ', error: err.message });
});

const PORT = process.env.PORT || 3004;
app.listen(PORT, () => {
    console.log(`Inventory-Service running on port ${PORT}`);
});