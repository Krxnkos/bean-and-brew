const { Router } = require('express');
const { login, register, logout } = require('../../database/controllers/authController');
const { validateLogin, validateRegister } = require('../../middleware/authMiddleware');

class AuthRoutes {
  constructor() {
    this.router = Router();
    this.initRoutes();
  }

  initRoutes() {
    this.router.get('/login', (_req, res) => {
      res.render('login');
    });
    this.router.get('/signup', (_req, res) => {
      res.render('signup');
    });
    this.router.post('/login', validateLogin(), async (req, res) => {
      try {
        const result = await login({
          body: {
            username: req.body.email.toLowerCase(),
            password: req.body.password
          }
        });
        
        if (!result) {
          return res.status(401).json({ error: 'Invalid credentials' });
        }
    
        res.cookie('firstName', result.firstName, { httpOnly: true });
        res.cookie('userType', result.userType, { httpOnly: true });
        return res.status(200).json({ 
          success: true, 
          redirect: '/menu',
          firstName: result.firstName,
          userType: result.userType 
        });
    
      } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ error: 'Internal server error' });
      }
    });
    
    this.router.post('/register', validateRegister(), async (req, res) => {
      try {
      const registrationData = {
        username: req.body.email, // Use email as username
        userType: 'customer', // Default to employee type
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password
      };

      console.log('Processed registration data:', registrationData);

      await register({ ...req, body: registrationData }, res);
      
      // Note: register function handles the response directly
      // so we don't need to handle the response here

      } catch (error) {
      console.error('Registration error:', error);
      if (error.name === 'ValidationError') {
        return res.status(400).json({ 
        error: 'Validation failed',
        details: error.errors 
        });
      }
      return res.status(500).json({ error: 'Internal server error' });
      }
    });
    this.router.get('/logout', async (req, res) => {
      try {
        await logout(req, res);
      } catch (error) {
        console.error('Logout error:', error);
        return res.status(500).json({ error: 'Internal server error' });
      }
    });
  }
}

module.exports = new AuthRoutes().router;