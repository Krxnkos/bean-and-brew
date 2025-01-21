const { Router } = require('express');
const productController = require('../../database/controllers/productController');

class ProductRoutes {
  constructor() {
    this.router = Router();
    this.initRoutes();
  }

  initRoutes() {
    this.router.get('/menu', productController.getAllProducts);
    this.router.post('/add-product', productController.addProduct);
    this.router.post('/reorder-stock', productController.reorderStock);
  }
}

module.exports = new ProductRoutes().router;