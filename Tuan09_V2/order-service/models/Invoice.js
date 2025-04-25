const mongoose = require('mongoose');

const invoiceDetailSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  quantity: { type: Number, required: true },
});

const invoiceSchema = new mongoose.Schema({
  invoiceId: { type: String, required: true, unique: true },
  customerId: { type: String, required: true },
  issueDate: { type: Date, required: true },
  total: { type: Number, required: true },
  invoiceDetails: [invoiceDetailSchema],
});

module.exports = mongoose.model('Invoice', invoiceSchema);