const mongoose = require('mongoose');
const Product = require('../src/models/Product'); // Adjust path if needed

const updateProductImages = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb+srv://gbtechtube:4nXOu410uuzH7d9w@cluster0.dzs4n.mongodb.net/product-catelog?retryWrites=true&w=majority', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

     // Find all products that have the imageUrl field
    const products = await Product.find({ imageUrl: { $exists: true } }).lean();
    console.log(`Found ${products.length} product(s) with imageUrl field.`);

    for (let product of products) {
      if (typeof product.imageUrl === 'string' && product.imageUrl.trim() !== '') {
        // Build new images array from imageUrl field
        const updatedImages = [{ rank: 1, url: product.imageUrl }];
        
        // Update the product: set images and remove imageUrl field
        const updatedProduct = await Product.findByIdAndUpdate(
          product._id,
          { $set: { images: updatedImages }, $unset: { imageUrl: 1 } },
          { new: true }
        );
        
        console.log(`Updated product ${updatedProduct._id}:`, updatedProduct.images);
      }
    }

    console.log('Database update complete.');
    mongoose.connection.close();
  } catch (error) {
    console.error('Error updating products:', error);
    mongoose.connection.close();
  }
};
updateProductImages();