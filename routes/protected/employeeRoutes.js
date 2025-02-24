const express = require('express');
const AuthMiddleware = require('../../middleware/authMiddleware');
const EmployeeController = require('../../database/controllers/employeeController');

class EmployeeRoutes {
    constructor() {
        this.router = express.Router();
        this.controller = new EmployeeController();
        this.initRoutes();
    }

    initRoutes() {
        // Apply authentication middleware first
        this.router.use(AuthMiddleware.authenticate);
        this.router.use(AuthMiddleware.requireEmployee);
        
        // Define routes
        this.router.get('/dashboard', this.renderDashboard.bind(this));
    }

    async renderDashboard(req, res) {
        try {
            const [manager, popularItems, upcomingShifts] = await Promise.all([
                this.controller.getManagerInfo(req.user.id),
                this.controller.getPopularItems(),
                this.controller.getUpcomingShifts(req.user.id)
            ]);

            res.render('employee/dashboard', {
                title: 'Employee Dashboard',
                user: req.user,
                manager,
                popularItems,
                upcomingShifts,
                userType: req.user.userType
            });
        } catch (error) {
            console.error('Dashboard error:', error);
            res.status(500).render('error', { 
                message: 'Error loading dashboard',
                error: error
            });
        }
    }

    getRouter() {
        return this.router;
    }
}

module.exports = new EmployeeRoutes().getRouter();