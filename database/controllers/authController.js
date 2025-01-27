/**
 * Title: authController.js
 * Author: Thomas Joseph Pullan
 * Co-Author(s):
 * Date: 21-01-2025
 * Description: This file contains the logic for handling user authentication
 */

require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

class AuthController {
  constructor() {
    this.secret = process.env.JWT_SECRET;
    this.login = this.login.bind(this);
  }

  async login(req, res) {
    const { username, password } = req.body;

    try {
      const user = await User.findOne({ username });
      if (!user) {
        console.log('User not found'); // Debugging log
        return res.status(401).json({ message: 'Invalid username or password' });
      }

      const isMatch = await user.comparePassword(password);
      console.log('Password match result:', isMatch); // Debugging log
      if (!isMatch) {
        console.log('Password does not match'); // Debugging log
        return res.status(401).json({ message: 'Invalid username or password' });
      }

      // Set cookies
      res.cookie('firstName', user.firstName, { httpOnly: true });
      res.cookie('userType', user.userType, { httpOnly: true }); // Set userType cookie

      console.log('User type set in cookie:', user.userType); // Debugging log

      res.redirect('/menu');
    } catch (err) {
      console.error('Error logging in:', err);
      res.status(500).json({ message: 'Server error' });
    }
  }

  async logout(req, res) {
    res.clearCookie('firstName');
    res.clearCookie('userType');
    res.redirect('/login');
  }
}

module.exports = new AuthController();