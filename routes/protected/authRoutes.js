const express = require('express');
const AuthController = require('../../database/controllers/authController');
const AuthMiddleware = require('../../middleware/authMiddleware');

class AuthRoutes {
    constructor() {
        this.router = express.Router();
        this.controller = new AuthController(); // Now this will work
        this.initRoutes();
    }

    initRoutes() {
        // Public routes
        this.router.get('/login', this.renderLogin.bind(this));
        this.router.post('/login', AuthMiddleware.validateLogin(), this.handleLogin.bind(this));
        this.router.get('/register', this.renderRegister.bind(this));
        this.router.post('/register', AuthMiddleware.validateRegister(), this.handleRegister.bind(this));
        this.router.get('/logout', this.handleLogout.bind(this));
    }

    renderLogin(req, res) {
        if (req.session?.user) {
            return res.redirect(this.getRedirectPath(req.session.user));
        }
        res.render('auth/login');
    }

    renderRegister(req, res) {
        res.render('auth/signup');
    }

    async handleLogin(req, res) {
        try {
            const result = await this.controller.login(
                req.body.username,
                req.body.password
            );
            
            if (!result) {
                return res.status(401).json({ 
                    success: false, 
                    message: 'Invalid credentials' 
                });
            }

            // Set session
            req.session.user = result.user;

            // Set cookies
            res.cookie('jwt', result.token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 24 * 60 * 60 * 1000
            });

            res.cookie('firstName', result.user.firstName);
            res.cookie('userType', result.user.userType);

            return res.json({
                success: true,
                user: result.user
            });
        } catch (error) {
            console.error('Login route error:', error);
            return res.status(500).json({ 
                success: false, 
                message: 'Internal server error' 
            });
        }
    }

    async handleRegister(req, res) {
        try {
            await this.controller.register(req.body);
            res.redirect('/auth/login');
        } catch (error) {
            console.error('Registration error:', error);
            res.status(400).json({ success: false, message: error.message });
        }
    }

    handleLogout(req, res) {
        this.controller.logout(req, res);
    }

    getRedirectPath(user) {
        return user.userType === 'employee' ? '/employee-dashboard' : '/customer-dashboard';
    }

    getRouter() {
        return this.router;
    }
}

module.exports = new AuthRoutes().getRouter();
