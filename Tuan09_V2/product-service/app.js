const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const productRoutes = require('./routes/productRoutes');

dotenv.config();
const app = express();
app.use(express.json());

// Kết nối MongoDB
connectDB();

// Routes
app.use('/api/products', productRoutes);

const PORT = process.env.PORT || 3004;
app.listen(PORT, () => {
  console.log(`ProductService running on port ${PORT}`);
});