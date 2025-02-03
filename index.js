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

require('dotenv').config();

// Create LiveReload server
const liveReloadServer = livereload.createServer();
liveReloadServer.watch(path.join(__dirname, 'static'));

class Server {
    constructor() {
        this.app = express();
        this.enableLiveReload();
        this.connectToDatabase();
        this.configureMiddleware();
        this.configureRoutes();
        this.startServer();
    }

    enableLiveReload() {
        this.app.use(connectLivereload());
        liveReloadServer.server.once("connection", () => {
            setTimeout(() => {
                liveReloadServer.refresh("/");
            }, 100);
        });
    }

    connectToDatabase() {
        mongoose.connect(process.env.DB_CONN, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }).then(() => {
            console.log('Connected to MongoDB');
        }).catch(err => {
            console.error('Failed to connect to MongoDB', err);
        });
    }

    configureMiddleware() {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(cookieParser());
        this.app.set('view engine', 'ejs');
        this.app.set('views', path.join(__dirname, 'views'));
        this.app.use(express.static(path.join(__dirname, 'static')));
        this.app.use((req, res, next) => {
            res.locals.firstName = req.cookies.firstName;
            res.locals.userType = req.cookies.userType;
            console.log('First name from cookie:', req.cookies.firstName); // Debugging log
            console.log('User type from cookie:', req.cookies.userType); // Debugging log
            next();
        });
    }

    configureRoutes() {
        this.app.use('/', unprotectedRoutes);
        this.app.use('/auth', authRoutes);
        this.app.use('/', productRoutes);
        this.app.use('/', bookingRoutes);
        this.app.use('/', orderRoutes);
    }

    startServer() {
        const port = process.env.PORT || 3000;
        this.app.listen(port, () => {
            console.log(`Server started at http://localhost:${port}`);
        });
    }
}

new Server();
