const { Router } = require('express');
const { requireAuth } = require('../../middleware/authMiddleware');
const Course = require('../../database/models/course');
const courseController = require('../../database/controllers/courseController');
const bookingController = require('../../database/controllers/bookingController');

class CourseRoutes {
    constructor() {
        this.router = Router();
        this.initRoutes();
    }

    initRoutes() {
        // Protect all routes in this router
        this.router.use(requireAuth);

        this.router.get('/learn', async (req, res) => {
            try {
                const courses = await courseController.getAllCourses();
                return res.render('learn/learn', { 
                    courses: courses || [],
                    user: req.user
                });
            } catch (error) {
                console.error('Learn page error:', error);
                return res.status(500).render('error', { 
                    error: 'Failed to load courses',
                    user: req.user
                });
            }
        });

        this.router.post('/course/create', async (req, res) => {
            if (req.user.userType !== 'employee') {
                return res.status(403).json({ error: 'Unauthorized' });
            }

            try {
                await courseController.createCourse(req.body);
                res.redirect('/learn');
            } catch (error) {
                res.redirect('/learn?error=Failed to create course');
            }
        });

        this.router.post('/course/:id/delete', async (req, res) => {
            if (req.user.userType !== 'employee') {
                return res.status(403).json({ error: 'Unauthorized' });
            }

            try {
                await courseController.deleteCourse(req.params.id);
                res.json({ success: true });
            } catch (error) {
                res.status(500).json({ error: 'Failed to delete course' });
            }
        });

        this.router.post('/course/:id/book', async (req, res) => {
            try {
                const course = await Course.findById(req.params.id);
                if (!course) {
                    return res.status(404).json({ error: 'Course not found' });
                }

                const session = course.sessions[req.body.sessionIndex];
                if (!session) {
                    return res.status(404).json({ error: 'Session not found' });
                }

                // Create the booking data object with explicit type
                const bookingData = {
                    userId: req.user.firstName,
                    firstName: req.user.firstName,
                    type: 'course',  // Explicitly set the type here
                    courseId: course._id,
                    courseName: course.name,
                    location: course.location,
                    date: new Date(session.date),
                    time: session.time,
                    status: 'confirmed',
                    guests: 1
                };

                // Create the booking
                const booking = await bookingController.createBooking(bookingData);

                // Update available spots
                session.availableSpots--;
                await course.save();

                res.json({ success: true, booking });
            } catch (error) {
                console.error('Course booking error:', error);
                res.status(500).json({ error: error.message });
            }
        });

        this.router.post('/course/:id/sessions', async (req, res) => {
            if (req.user.userType !== 'employee') {
                return res.status(403).json({ error: 'Unauthorized' });
            }

            try {
                console.log('Received session data:', req.body);
                const course = await courseController.addSessions(req.params.id, req.body);
                return res.json({ success: true, sessions: course.sessions });
            } catch (error) {
                console.error('Add sessions error:', error);
                return res.status(500).json({ error: error.message || 'Failed to add sessions' });
            }
        });
    }
}

module.exports = new CourseRoutes().router;