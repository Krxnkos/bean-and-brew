/**
 * Title: injectSampleProducts.js
 * Author: Thomas Joseph Pullan
 * Co-Author(s):
 * Created: 20-01-2025
 * Description: This file is used to insert sample data into the MongoDB database for when Thunderclient doesnt work
 */

/**
 *  ### USING THE INJECTOR ###
 * 1. Put this file in the root directory of the project
 * 2. Insert the sample data into the sampleProducts section in a JSON format
 * 3. Run the file using the command `node injectSampleProducts.js`
 */

const mongoose = require('mongoose');
const Product = require('./database/models/product');

require('dotenv').config();

const sampleProducts = [
  {
    name: 'Espresso',
    price: 2.5,
    imageUrl: 'https://example.com/images/espresso.jpg',
    stockQuantity: 100,
    description: 'A strong and bold coffee shot.'
  },
  {
    name: 'Cappuccino',
    price: 3.0,
    imageUrl: 'https://example.com/images/cappuccino.jpg',
    stockQuantity: 50,
    description: 'A rich and creamy coffee with steamed milk.'
  },
  {
    name: 'Latte',
    price: 3.5,
    imageUrl: 'https://example.com/images/latte.jpg',
    stockQuantity: 75,
    description: 'A smooth and milky coffee with a touch of foam.'
  },
  {
    name: 'Mocha',
    price: 4.0,
    imageUrl: 'https://example.com/images/mocha.jpg',
    stockQuantity: 30,
    description: 'A chocolate-flavored coffee with whipped cream.'
  },
  {
    name: 'Americano',
    price: 2.0,
    imageUrl: 'https://example.com/images/americano.jpg',
    stockQuantity: 80,
    description: 'A simple and classic black coffee.'
  }
];

async function insertSampleData() {
  try {
    await mongoose.connect(process.env.DB_CONN, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');

    await Product.deleteMany({});
    console.log('Cleared existing products');

    await Product.insertMany(sampleProducts);
    console.log('Inserted sample products');

    mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (err) {
    console.error('Error inserting sample data:', err);
  }
}

insertSampleData();