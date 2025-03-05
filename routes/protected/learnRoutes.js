const express = require('express');
const { body, validationResult } = require('express-validator');
const AuthMiddleware = require('../../middleware/authMiddleware');
const LearnController = require('../../database/controllers/learnController');
const Course = require('../../database/models/Course');

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
        this.router.post('/courses', 
            [
                body('courses').isArray(),
                body('courses.*.name').notEmpty().trim(),
                body('courses.*.location').isIn(['Leeds', 'Harrogate', 'Knaresborough Castle']),
                body('courses.*.duration').optional().isNumeric(),
                body('courses.*.price').optional().isNumeric(),
                body('courses.*.maxParticipants').optional().isNumeric(),
                body('courses.*.sessions').isArray(),
                body('courses.*.sessions.*.date').isISO8601(),
                body('courses.*.sessions.*.time').matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/),
                body('courses.*.sessions.*.availableSpots').isNumeric()
            ],
            this.createCourses.bind(this)
        );
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

    async createCourses(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors: errors.array()
                });
            }

            const { courses } = req.body;
            
            if (!courses || !Array.isArray(courses)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid request format'
                });
            }

            const createdCourses = await Course.insertMany(courses);
            
            res.status(201).json({
                success: true,
                message: `Created ${createdCourses.length} courses successfully`,
                courses: createdCourses
            });
        } catch (error) {
            console.error('Create courses error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to create courses',
                error: error.message
            });
        }
    }

    getRouter() {
        return this.router;
    }
}

module.exports = new LearnRoutes().getRouter();