const User = require('../models/User');
const jwt = require('jsonwebtoken');

class AuthController {
    constructor() {
        // Bind methods to instance
        this.login = this.login.bind(this);
        this.register = this.register.bind(this);
    }

    async login(email, password) {
        try {
            const user = await User.findOne({ email: email.toLowerCase() });
            if (!user) return null;

            const isMatch = await user.comparePassword(password);
            if (!isMatch) return null;

            const token = jwt.sign(
                { 
                    id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    userType: user.userType 
                },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            return { token, user };
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    }

    async register(userData) {
        try {
            const user = new User({
                firstName: userData.firstName,
                lastName: userData.lastName,
                email: userData.email.toLowerCase(),
                password: userData.password
            });
            
            await user.save();
            return user;
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    }
}

module.exports = AuthController;