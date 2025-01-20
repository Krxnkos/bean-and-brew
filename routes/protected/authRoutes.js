const { Router } = require('express');
const { login, register } = require('../../database/controllers/authController');
const { validateLogin, validateRegister } = require('../../middleware/authMiddleware');

class AuthRoutes {
  constructor() {
    this.router = Router();
    this.initRoutes();
  }

  initRoutes() {
    this.router.post('/login', validateLogin(), login);
    this.router.post('/register', validateRegister(), register);
  }
}

module.exports = new AuthRoutes().router;