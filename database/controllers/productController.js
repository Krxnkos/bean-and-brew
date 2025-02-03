const Product = require('../models/product');

class ProductController {
  async getAllProducts(req, res) {
    try {
      const products = await Product.find();
      res.render('menu', { products, userType: req.cookies.userType });
    } catch (err) {
      console.error('Error fetching products:', err);
      res.status(500).json({ message: 'Server error' });
    }
  }

  async addProduct(req, res) {
    const { name, price, imageUrl, stockQuantity, description } = req.body;

    try {
      const newProduct = new Product({ name, price, imageUrl, stockQuantity, description });
      await newProduct.save();
      res.redirect('/menu');
    } catch (err) {
      console.error('Error adding product:', err);
      res.status(500).json({ message: 'Server error' });
    }
  }

  async setStock(req, res) {
    const { productId, stockQuantity } = req.body;

    try {
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }

      product.stockQuantity = parseInt(stockQuantity, 10);
      await product.save();
      res.redirect('/menu');
    } catch (err) {
      console.error('Error setting stock:', err);
      res.status(500).json({ message: 'Server error' });
    }
  }

  async reorderStock(req, res) {
    const { productId, quantity } = req.body;

    try {
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }

      product.stockQuantity += parseInt(quantity, 10);
      await product.save();
      res.redirect('/menu');
    } catch (err) {
      console.error('Error reordering stock:', err);
      res.status(500).json({ message: 'Server error' });
    }
  }

  async getAllProducts() {
    try {
      const products = await Product.find({});
      return products;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }
}

module.exports = new ProductController();