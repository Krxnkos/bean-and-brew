const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  stockQuantity: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  }
});

// Check if model exists before creating
module.exports = mongoose.models.Product || mongoose.model('Product', ProductSchema);