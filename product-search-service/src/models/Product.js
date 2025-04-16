const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  images: [{ 
    rank: { type: Number, required: true },
    url: { type: String, required: true }
  }], 
  category: { 
    type: String, 
    enum: ['Clothing', 'Accessories', 'Footwear', 'Beauty', 'Electronics'], 
    // required: true 
  },
  featuredTags: { 
    type: [String], 
    enum: ['Featured', 'Popular', 'New Arrival', 'Best Seller'], 
    default: [] 
  },
  gender: { type: String, enum: ['Men', 'Women', 'Unisex'], required: true },
  sizes: { type: [String], enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL'], default: [] },
  style: { type: String, enum: ['Indian', 'Western', 'Fusion', 'Casual', 'Formal', 'Sports'], required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);
