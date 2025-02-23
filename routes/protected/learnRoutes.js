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
        // Use the static authenticate method correctly
        this.router.use(AuthMiddleware.authenticate);

        // Define routes
        this.router.get('/learn', this.getAllCourses.bind(this));
        this.router.get('/learn/:id', this.getCourseById.bind(this));
        this.router.post('/learn', this.createCourse.bind(this));
        this.router.put('/learn/:id', this.updateCourse.bind(this));
        this.router.delete('/learn/:id', this.deleteCourse.bind(this));
    }

    async getAllCourses(req, res) {
        try {
            const courses = await this.controller.getAllCourses();
            res.json(courses);
        } catch (error) {
            console.error('Get courses error:', error);
            res.status(500).json({ message: 'Error fetching courses' });
        }
    }

    async getCourseById(req, res) {
        try {
            const course = await this.controller.getCourseById(req.params.id);
            if (!course) {
                return res.status(404).json({ message: 'Course not found' });
            }
            res.json(course);
        } catch (error) {
            console.error('Get course error:', error);
            res.status(500).json({ message: 'Error fetching course' });
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

    async updateCourse(req, res) {
        try {
            const course = await this.controller.updateCourse(req.params.id, req.body);
            if (!course) {
                return res.status(404).json({ message: 'Course not found' });
            }
            res.json(course);
        } catch (error) {
            console.error('Update course error:', error);
            res.status(500).json({ message: 'Error updating course' });
        }
    }

    async deleteCourse(req, res) {
        try {
            const result = await this.controller.deleteCourse(req.params.id);
            if (!result) {
                return res.status(404).json({ message: 'Course not found' });
            }
            res.json({ message: 'Course deleted successfully' });
        } catch (error) {
            console.error('Delete course error:', error);
            res.status(500).json({ message: 'Error deleting course' });
        }
    }

    getRouter() {
        return this.router;
    }
}

module.exports = new LearnRoutes().getRouter();