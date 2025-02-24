const express = require('express');
const AuthMiddleware = require('../../middleware/authMiddleware');
const LearnController = require('../../database/controllers/learnController');

class LearnRoutes {
    constructor() {
        this.router = express.Router();
        this.controller = new LearnController();
        this.initRoutes();
    }

    initRoutes() {
        // Public route for the learn page
        this.router.get('/', this.renderLearnPage.bind(this));
        
        // Protected routes
        this.router.post('/', AuthMiddleware.authenticate, this.createCourse.bind(this));
    }

    async renderLearnPage(req, res) {
        try {
            const courses = await this.controller.getAllCourses();
            res.render('learn/learn', {
                title: 'Learning Hub',
                courses: courses || [],
                user: req.session?.user || null,
                userType: req.cookies?.userType || null
            });
        } catch (error) {
            console.error('Error rendering learn page:', error);
            res.status(500).render('error', { 
                message: 'Error loading learning content',
                error: error
            });
        }
    }

    async createCourse(req, res) {
        try {
            const course = await this.controller.createCourse(req.body);
            res.status(201).json(course);
        } catch (error) {
            console.error('Create course error:', error);
            res.status(500).json({ message: 'Error creating course' });
        }
    }

    getRouter() {
        return this.router;
    }
}

module.exports = new LearnRoutes().getRouter();