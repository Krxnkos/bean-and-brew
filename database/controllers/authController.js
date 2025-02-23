/**
 * Title: authController.js
 * Author: Thomas Joseph Pullan
 * Co-Author(s):
 * Date: 21-01-2025
 * Description: This file contains the logic for handling user authentication
 */

const User = require('../models/User');
const jwt = require('jsonwebtoken');

class AuthController {
    constructor() {
        // Bind methods to instance
        this.login = this.login.bind(this);
        this.register = this.register.bind(this);
        this.logout = this.logout.bind(this);
    }

    async login(username, password) {
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

            const token = jwt.sign(
                { 
                    id: user._id,
                    firstName: user.firstName,
                    userType: user.userType 
                },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );
        
            return {
                token,
                user: {
                    firstName: user.firstName,
                    userType: user.userType
                }
            };
        } catch (err) {
            console.error('Login error:', err);
            throw err;
        }
    }

    async register(userData) {
        try {
            const user = new User(userData);
            await user.save();
            return user;
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    }

    logout(req, res) {
        req.session.destroy();
        res.clearCookie('jwt');
        res.redirect('/auth/login');
    }
}

// Export the class itself, not an instance
module.exports = AuthController;