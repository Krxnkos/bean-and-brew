/**
 * Title: testProductModel.js
 * Author: Thomas Joseph Pullan
 * Co-Author(s):
 * Created: 20-01-2025
 * Description: This file is used to test the product model by inputting a sample product into the database and fetching it.
 */

/**
 *  ### USING THE MODEL TESTER ###
 * 1. Put this file in the root directory of the project
 * 2. Run the file using the command `node injectSampleProducts.js`
 */

const mongoose = require('mongoose');
const Product = require('./models/product');

require('dotenv').config();

async function testProductModel() {
  try {
    await mongoose.connect(process.env.DB_CONN, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');

    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Create a new product
    const newProduct = new Product({
      name: 'Test Product',
      price: 10.0,
      imageUrl: 'https://example.com/images/test-product.jpg',
      stockQuantity: 50,
      description: 'This is a test product.'
    });

    await newProduct.save();
    console.log('New product saved:', newProduct);

    // Fetch all products
    const products = await Product.find();
    console.log('Fetched products:', products);

    mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (err) {
    console.error('Error testing Product model:', err);
  }
}

testProductModel();