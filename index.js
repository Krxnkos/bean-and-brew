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
const orderRoutes = require('./routes/protected/orderRoutes');
const courseRoutes = require('./routes/protected/learnRoutes'); // Add this line
const learnRoutes = require('./routes/protected/learnRoutes');
const employeeRoutes = require('./routes/protected/employeeRoutes');
const session = require('express-session');
const AuthMiddleware = require('./middleware/authMiddleware');

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
            res.locals.user = req.session.user;
            res.locals.isAuthenticated = !!req.session.user;
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
    }

    setupViewEngine() {
        this.app.set('views', path.join(__dirname, 'views'));
        this.app.set('view engine', 'ejs');
        this.app.use(express.static(path.join(__dirname, 'static')));

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

        // Protected routes with authentication
        this.app.use('/employee', employeeRoutes);
        this.app.use('/learn', learnRoutes);
        this.app.use('/booking', bookingRoutes);
        this.app.use('/order', orderRoutes);
        this.app.use('/menu', productRoutes);
        this.app.use('/course', courseRoutes);
    }

    startServer() {
        const port = process.env.PORT || 3000;
        this.app.listen(port, () => {
            console.log(`Server started at http://localhost:${port}`);
        });
    }
}

new Server();
