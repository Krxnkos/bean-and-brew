const { Router } = require('express');
const productController = require('../../database/controllers/productController');
const Product = require('../../database/models/product');

class ProductRoutes {
  constructor() {
    this.router = Router();
    this.initRoutes();
  }

  initRoutes() {
    this.router.get('/menu', async (req, res) => {
      try {
        const products = await Product.find().lean();
        res.render('menu', { products, userType: req.cookies.userType });
      } catch (err) {
        console.error('Error fetching products:', err);
        res.status(500).json({ message: 'Server error' });
      }
    });
    this.router.post('/add-product', productController.addProduct);
    this.router.post('/set-stock', productController.setStock);
    this.router.post('/reorder-stock', productController.reorderStock);
  }
}

module.exports = new ProductRoutes().router;