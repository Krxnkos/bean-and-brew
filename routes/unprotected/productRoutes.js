const { Router } = require('express');
const productController = require('../../database/controllers/productController');

class ProductRoutes {
  constructor() {
    this.router = Router();
    this.initRoutes();
  }

  initRoutes() {
    this.router.get('/menu', productController.getAllProducts);
  }
}

module.exports = new ProductRoutes().router;