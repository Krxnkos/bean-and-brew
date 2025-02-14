const Course = require('../models/course');

class CourseController {
    async getAllCourses() {
        try {
            console.log('Fetching all courses...');
            const courses = await Course.find({}).lean();
            
            if (!courses) {
                console.log('No courses found');
                return [];
            }

            // Filter out past sessions and sort upcoming ones
            const now = new Date();
            courses.forEach(course => {
                if (course.sessions) {
                    course.sessions = course.sessions
                        .filter(session => new Date(session.date) > now)
                        .sort((a, b) => new Date(a.date) - new Date(b.date));
                }
            });

            console.log(`Found ${courses.length} courses`);
            return courses;
        } catch (error) {
            console.error('Error in getAllCourses:', error);
            return [];
        }
    }

    async createCourse(courseData) {
        try {
            const course = new Course(courseData);
            return await course.save();
        } catch (error) {
            console.error('Error creating course:', error);
            throw error;
        }
    }

    async deleteCourse(courseId) {
        try {
            return await Course.findByIdAndDelete(courseId);
        } catch (error) {
            console.error('Error deleting course:', error);
            throw error;
        }
    }

    async getCourseById(courseId) {
        try {
            return await Course.findById(courseId).lean();
        } catch (error) {
            console.error('Error fetching course:', error);
            throw error;
        }
    }

    async addSessions(courseId, sessionData) {
        try {
            const course = await Course.findById(courseId);
            if (!course) throw new Error('Course not found');

            const { startDate, time, numberOfSessions, frequency } = sessionData;
            const sessions = [];

            // Convert startDate string to Date object
            let currentDate = new Date(startDate);
            currentDate.setHours(...time.split(':'));

            // Create single or multiple sessions
            const sessionsToCreate = numberOfSessions || 1;
            for (let i = 0; i < sessionsToCreate; i++) {
                sessions.push({
                    date: new Date(currentDate),
                    time: time,
                    availableSpots: course.maxParticipants
                });

                if (frequency) {
                    currentDate.setDate(currentDate.getDate() + parseInt(frequency));
                }
            }

            // Add new sessions to course
            course.sessions = course.sessions.concat(sessions);
            
            // Sort sessions by date
            course.sessions.sort((a, b) => a.date - b.date);
            
            await course.save();
            return course;
        } catch (error) {
            console.error('Error adding sessions:', error);
            throw error;
        }
    }
}

module.exports = new CourseController();