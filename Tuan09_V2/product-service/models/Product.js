const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  productId: { type: String, required: true, unique: true },
  productName: { type: String, required: true },
  sellingPrice: { type: Number, required: true },
  discount: { type: Number, default: 0 },
});

module.exports = mongoose.model('Product', productSchema);