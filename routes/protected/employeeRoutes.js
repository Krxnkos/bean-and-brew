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
            console.log('Dashboard request for user:', {
                id: req.user.id,
                userType: req.user.userType,
                jobTitle: req.user.jobTitle
            });

            let viewData = {
                user: req.user,
                userType: req.user.userType,
                shifts: [],
                popularItems: [],
                teamMembers: [],
                supervisor: null,
                manager: null  // Initialize manager property
            };

            try {
                // Get popular items for all users
                viewData.popularItems = await this.controller.getPopularItems();

                if (req.user.userType === 'employee') {
                    // For regular employees, get their manager
                    const manager = await this.controller.getManagerInfo(req.user.id);
                    viewData.manager = manager;
                    
                    // Get employee shifts
                    const shifts = await this.controller.getUpcomingShifts(req.user.id);
                    viewData.shifts = shifts;

                } else if (['manager', 'admin'].includes(req.user.userType)) {
                    // For managers and admins
                    if (req.user.jobTitle !== 'Operations Manager') {
                        const supervisor = await this.controller.getManagerInfo(req.user.id);
                        viewData.supervisor = supervisor;
                    }

                    const teamMembers = await this.controller.getTeamMembers(req.user.id);
                    viewData.teamMembers = teamMembers;

                    const shifts = await this.controller.getUpcomingShifts(req.user.id);
                    viewData.shifts = shifts;
                }

            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            }

            console.log('Final viewData:', {
                userType: viewData.userType,
                hasManager: !!viewData.manager,
                hasSupervisor: !!viewData.supervisor,
                teamMembersCount: viewData.teamMembers?.length,
                shiftsCount: viewData.shifts?.length
            });

            res.render('employee/dashboard', viewData);

        } catch (error) {
            console.error('Dashboard render error:', error);
            res.status(500).render('error', { 
                message: 'Error loading dashboard',
                error: error.message 
            });
        }
    }

    getRouter() {
        return this.router;
    }
}

module.exports = new EmployeeRoutes().getRouter();