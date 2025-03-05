const express = require('express');
const AuthMiddleware = require('../../middleware/authMiddleware');
const AccountController = require('../../database/controllers/accountController');

class AccountRoutes {
    constructor() {
        this.router = express.Router();
        this.controller = new AccountController();
        this.initRoutes();
    }

    initRoutes() {
        this.router.get('/', 
            AuthMiddleware.authenticate,
            this.getAccountPage.bind(this)
        );
    }

    async getAccountPage(req, res) {
        try {
            const userData = await this.controller.getUserData(req.user._id);
            
            res.render('account/account', {
                title: 'My Account',
                user: req.user,
                userType: req.user.userType,
                bookings: userData.bookings,
                courses: userData.courses,
                orders: userData.orders
            });
        } catch (error) {
            console.error('Account page error:', error);
            res.status(500).render('error', { 
                message: 'Failed to load account page'
            });
        }
    }

    getRouter() {
        return this.router;
    }
}

module.exports = new AccountRoutes().getRouter();