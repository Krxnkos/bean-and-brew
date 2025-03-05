/**
 * Title: index.js
 * Author: Thomas Joseph Pullan
 * Co-Author(s): Toby James Fox
 * Created: 20-01-2025
 * Description: This file is the entry point for the website with LiveReload support
 */

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cookieParser = require('cookie-parser');
const livereload = require('livereload');
const connectLivereload = require('connect-livereload');
const unprotectedRoutes = require('./routes/unprotected/unprotectedRoutes');
const authRoutes = require('./routes/protected/authRoutes');
const productRoutes = require('./routes/unprotected/productRoutes');
const bookingRoutes = require('./routes/protected/bookingRoutes');
const orderRoutes = require('./routes/protected/orderRoutes');  // Updated import
const learnRoutes = require('./routes/protected/learnRoutes');
const employeeRoutes = require('./routes/protected/employeeRoutes');
const courseRoutes = require('./routes/protected/learnRoutes');
const accountRoutes = require('./routes/protected/accountRoutes');
const session = require('express-session');
const AuthMiddleware = require('./middleware/authMiddleware');
const helmet = require('helmet');
const jwt = require('jsonwebtoken'); // Added import

require('dotenv').config();

// Create LiveReload server
const liveReloadServer = livereload.createServer();
liveReloadServer.watch(path.join(__dirname, 'static'));

class Server {
    constructor() {
        this.app = express();
        this.connectToDatabase();
        this.enableLiveReload();
        this.configureMiddleware();
        this.setupViewEngine();
        this.configureRoutes();
        this.startServer();
    }

    async connectToDatabase() {
        try {
            await mongoose.connect(process.env.DB_CONN, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            });
            console.log('Connected to MongoDB');
        } catch (err) {
            console.error('MongoDB connection error:', err);
            process.exit(1);
        }
    }

    enableLiveReload() {
        this.app.use(connectLivereload());
        liveReloadServer.server.once("connection", () => {
            setTimeout(() => {
                liveReloadServer.refresh("/");
            }, 100);
        });
    }

    configureMiddleware() {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(cookieParser());
        this.app.use(session({
            secret: process.env.SESSION_SECRET,
            resave: false,
            saveUninitialized: false,
            cookie: {
                secure: process.env.NODE_ENV === 'production',
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000 // 24 hours
            }
        }));

        // Add global user data middleware
        this.app.use((req, res, next) => {
            // Get user data from JWT token
            const token = req.cookies.jwt;
            if (token) {
                try {
                    const decoded = jwt.verify(token, process.env.JWT_SECRET);
                    res.locals.user = decoded;
                    res.locals.userType = decoded.userType;
                    res.locals.isAuthenticated = true;
                } catch (error) {
                    res.locals.user = null;
                    res.locals.userType = null;
                    res.locals.isAuthenticated = false;
                }
            } else {
                res.locals.user = null;
                res.locals.userType = null;
                res.locals.isAuthenticated = false;
            }
            next();
        });

        this.app.use((req, res, next) => {
            res.locals.firstName = req.cookies.firstName;
            res.locals.userType = req.cookies.userType;
            console.log('First name from cookie:', req.cookies.firstName); // Debugging log
            console.log('User type from cookie:', req.cookies.userType); // Debugging log
            next();
        });

        // Debug middleware to log session data
        this.app.use((req, res, next) => {
            console.log('Session:', req.session);
            next();
        });

        // Configure CSP
        this.app.use(helmet({
            contentSecurityPolicy: {
                directives: {
                    defaultSrc: ["'self'"],
                    scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "localhost:35729"],
                    styleSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com", "https://fonts.googleapis.com", "https://fonts.gstatic.com"],
                    imgSrc: ["'self'", "data:", "https:", "blob:"],
                    connectSrc: ["'self'", "ws://localhost:35729"],
                    fontSrc: ["'self'", "https://cdnjs.cloudflare.com", "https://fonts.gstatic.com", "https://fonts.googleapis.com"],
                    objectSrc: ["'none'"],
                    mediaSrc: ["'self'"],
                    frameSrc: ["'none'"],
                    scriptSrcAttr: ["'unsafe-inline'"],
                    scriptSrcElem: ["'self'", "'unsafe-inline'"],
                    styleSrcElem: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com", "https://fonts.googleapis.com"]
                },
            },
        }));
    }

    setupViewEngine() {
        this.app.set('views', path.join(__dirname, 'views'));
        this.app.set('view engine', 'ejs');
        this.app.use(express.static(path.join(__dirname, 'static')));
        this.app.use(express.static('static'));

        // Serve static files with correct MIME types
        this.app.use('/css', express.static(path.join(__dirname, 'static/styles'), {
            setHeaders: (res, path) => {
                if (path.endsWith('.css')) {
                    res.setHeader('Content-Type', 'text/css');
                }
            }
        }));
    }

    configureRoutes() {
        // Public routes first
        this.app.use('/', unprotectedRoutes);
        this.app.use('/auth', authRoutes);
        this.app.use('/menu', productRoutes);
        
        // Order routes
        this.app.use('/orders', orderRoutes); // Changed from /order to /orders
        this.app.use('/api/orders', orderRoutes);

        // Protected routes with authentication
        this.app.use('/employee', employeeRoutes);
        this.app.use('/learn', learnRoutes);
        this.app.use('/booking', bookingRoutes);
        this.app.use('/api/courses', courseRoutes);
        this.app.use('/account', accountRoutes);
    }

    startServer() {
        const port = process.env.PORT || 3000;
        this.app.listen(port, () => {
            console.log(`Server started at http://localhost:${port}`);
        });
    }
}

new Server();
