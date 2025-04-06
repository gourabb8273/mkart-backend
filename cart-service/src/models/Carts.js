const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    default: 1
  },
  addedAt: {
    type: Date,
    default: Date.now
  },
  ordered: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('Cart', CartSchema);
