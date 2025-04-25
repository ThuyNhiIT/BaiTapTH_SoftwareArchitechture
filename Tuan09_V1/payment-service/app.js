const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const paymentRouter = require('./routes/paymentRouter');

dotenv.config();
const app = express();
app.use(express.json());

// Kết nối MongoDB
connectDB();

// Routes
app.use('/api/payments', paymentRouter);

const PORT = process.env.PORT || 3006;
app.listen(PORT, () => {
  console.log(`PaymentService running on port ${PORT}`);
});