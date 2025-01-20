/**
 * Title: index.js
 * Author: Thomas Joseph Pullan
 * Co-Author(s): Toby James Fox
 * Created: 20-01-2025
 * Description: This file is the entry point for the website
 */

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const unprotectedRoutes = require('./routes/unprotected/unprotectedRoutes');
const authRoutes = require('./routes/protected/authRoutes');

require('dotenv').config();

class Server {
    constructor() {
        this.app = express();
        this.connectToDatabase();
        this.configureMiddleware();
        this.configureRoutes();
        this.startServer();
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
        this.app.set('view engine', 'ejs');
        this.app.set('views', path.join(__dirname, 'views'));
        this.app.use(express.static(path.join(__dirname, 'public')));
    }

    configureRoutes() {
        this.app.use('/', unprotectedRoutes);
        this.app.use('/auth', authRoutes);
    }

    startServer() {
        const port = process.env.PORT || 3000;
        this.app.listen(port, () => {
            console.log(`Server started at http://localhost:${port}`);
        });
    }
}

new Server();
