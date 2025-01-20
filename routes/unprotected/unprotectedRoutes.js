const { Router } = require('express');

class UnprotectedRoutes {
  constructor() {
    this.router = Router();
    this.initRoutes();
  }

  initRoutes() {
    this.router.get('/', (req, res) => {
      res.render('index');
    });

    this.router.get('/about', (req, res) => {
      res.send('About Page');
    });

    this.router.get('/contact', (req, res) => {
      res.send('Contact Page');
    });
  }
}

module.exports = new UnprotectedRoutes().router;