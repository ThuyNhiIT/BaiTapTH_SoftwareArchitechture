const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const orderRoutes = require('./routes/orderRoutes');

dotenv.config();
const app = express();
app.use(express.json());

// Kết nối MongoDB
connectDB();

// Routes
app.use('/api/invoices', orderRoutes);

const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
  console.log(`OrderService running on port ${PORT}`);
});