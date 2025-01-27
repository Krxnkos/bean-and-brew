/**
 * Title: authController.js
 * Author: Thomas Joseph Pullan
 * Co-Author(s):
 * Date: 21-01-2025
 * Description: This file contains the logic for handling user authentication
 */

const dotenv = require('dotenv');
const User = require('../models/user');

dotenv.config();

class AuthController {
  constructor() {
    this.secret = process.env.JWT_SECRET;
    this.login = this.login.bind(this);
  }
  async login(req) {
    const { username, password } = req.body;
  
    try {
      if (!username) {
        return null;
      }
      
      const user = await User.findOne({ username: username.toLowerCase() });
      if (!user) {
        return null;
      }
  
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return null;
      }
  
      return {
        firstName: user.firstName,
        userType: user.userType
      };
    } catch (err) {
      console.error('Error logging in:', err);
      throw err;
    }
  }

  async logout(_, res) {
    res.clearCookie('firstName');
    res.clearCookie('userType');
    res.redirect('/auth/login');
  }

  async register(req, res) {
    const { username, password, firstName, lastName, email, userType } = req.body;
    try {
      // Check if user already exists
      const existingUser = await User.findOne({ 
        $or: [
          { email: email.toLowerCase() },
          { username: username.toLowerCase() }
        ]
      });
  
      if (existingUser) {
        return res.status(400).json({ 
          error: 'User already exists with this email or username'
        });
      }
  
      const user = new User({ 
        username: email.toLowerCase(), 
        email: email.toLowerCase(),
        password, 
        firstName,
        lastName, 
        userType 
      });
  
      await user.save();
      res.status(201).json({ 
        success: true,
        message: 'User registered successfully' 
      });
    } catch (err) {
      console.error('Error registering user:', err);
      res.status(500).json({ 
        error: 'Registration failed',
        message: err.message 
      });
    }
  }
}

module.exports = new AuthController();