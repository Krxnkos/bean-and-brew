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
    this.register = this.register.bind(this);
  }

  async login(req, res) {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'User not found' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      const token = jwt.sign({ id: user._id, userType: user.userType, firstName: user.firstName }, this.secret, { expiresIn: '1h' });
      res.json({ token, firstName: user.firstName });
    } catch (err) {
      console.error('Login error:', err);
      res.status(500).json({ message: 'Server error' });
    }
  }

  async register(req, res) {
    const { email, password, firstName, lastName } = req.body;

    console.log('Register request body:', req.body);

    try {
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ message: 'User already exists' });
      }

      user = new User({ email, password, firstName, lastName });
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save();

      const token = jwt.sign({ id: user._id, userType: user.userType, firstName: user.firstName }, this.secret, { expiresIn: '1h' });
      res.json({ token, firstName: user.firstName });
    } catch (err) {
      console.error('Register error:', err);
      res.status(500).json({ message: 'Server error' });
    }
  }
}

module.exports = new AuthController();