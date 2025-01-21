const Product = require('../models/product');

class ProductController {
  async getAllProducts(req, res) {
    try {
      const products = await Product.find();
      res.render('menu', { products });
    } catch (err) {
      console.error('Error fetching products:', err);
      res.status(500).json({ message: 'Server error' });
    }
  }
}

module.exports = new ProductController();