const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const shipmentRoutes = require('./routes/shipmentRoutes');

dotenv.config();
const app = express();
app.use(express.json());

// Kết nối MongoDB
connectDB();

// Routes
app.use('/api/shipments', shipmentRoutes);

const PORT = process.env.PORT || 3007;
app.listen(PORT, () => {
  console.log(`ShipmentService running on port ${PORT}`);
});