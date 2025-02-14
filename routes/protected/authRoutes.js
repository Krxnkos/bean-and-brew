const { Router } = require('express');
const jwt = require('jsonwebtoken');
const User = require('../../database/models/user');
const { login, register, logout } = require('../../database/controllers/authController');
const { check, validationResult } = require('express-validator');

class AuthRoutes {
    constructor() {
        this.router = Router();
        this.initRoutes();
    }

    // Validation middleware
    validateRegister() {
        return [
            check('email').isEmail().withMessage('Enter a valid email'),
            check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
            check('firstName').notEmpty().withMessage('First name is required'),
            check('lastName').notEmpty().withMessage('Last name is required'),
            (req, res, next) => {
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    return res.status(400).json({ errors: errors.array() });
                }
                next();
            }
        ];
    }

    initRoutes() {
        this.router.get('/login', (req, res) => {
            if (req.cookies.jwt) {
                try {
                    jwt.verify(req.cookies.jwt, process.env.JWT_SECRET);
                    return res.redirect('/');
                } catch (error) {
                    res.clearCookie('jwt');
                }
            }
            res.render('auth/login', { error: req.query.error });
        });

        this.router.get('/signup', (_req, res) => {
            res.render('signup');
        });

        this.router.get('/register', (req, res) => {
            // If already logged in, redirect to home
            if (req.cookies.jwt) {
                try {
                    jwt.verify(req.cookies.jwt, process.env.JWT_SECRET);
                    return res.redirect('/');
                } catch (error) {
                    res.clearCookie('jwt');
                }
            }
            res.render('auth/signup', { error: req.query.error });
        });

        this.router.post('/login', async (req, res) => {
            try {
                const { email, password } = req.body;
                const user = await User.login(email, password);
                
                const token = jwt.sign(
                    { 
                        firstName: user.firstName,
                        userType: user.userType,
                        id: user._id 
                    }, 
                    process.env.JWT_SECRET,
                    { expiresIn: '24h' }
                );

                res.cookie('jwt', token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    maxAge: 24 * 60 * 60 * 1000 // 24 hours
                });

                res.redirect('/');
            } catch (error) {
                console.error('Login error:', error);
                res.render('auth/login', { error: error.message });
            }
        });

        this.router.post('/register', this.validateRegister(), async (req, res) => {
            try {
                const registrationData = {
                    username: req.body.email,
                    userType: 'customer',
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    email: req.body.email,
                    password: req.body.password
                };

                console.log('Processing registration:', registrationData);
                await register({ ...req, body: registrationData }, res);

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