const { Router } = require('express');
const { login, register } = require('../../database/controllers/authController');
const { validateLogin, validateRegister } = require('../../middleware/authMiddleware');

class AuthRoutes {
  constructor() {
    this.router = Router();
    this.initRoutes();
  }

  initRoutes() {
    this.router.get('/login', (req, res) => {
      res.render('login');
    });
    this.router.get('/signup', (req, res) => {
      res.render('signup');
    });
    this.router.post('/login', validateLogin(), async (req, res) => {
      const result = await login(req, res);
      if (result && result.firstName) {
        res.cookie('firstName', result.firstName, { httpOnly: true });
        res.redirect('/');
      }
    });
    this.router.post('/register', validateRegister(), async (req, res) => {
      const result = await register(req, res);
      if (result && result.firstName) {
        res.cookie('firstName', result.firstName, { httpOnly: true });
        res.redirect('/');
      }
    });
  }
}

module.exports = new AuthRoutes().router;