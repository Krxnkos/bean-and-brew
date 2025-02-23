const Course = require('../models/Course');

class LearnController {
    async getAllCourses() {
        try {
            return await Course.find();
        } catch (error) {
            console.error('Get all courses error:', error);
            throw error;
        }
    }

    async getCourseById(id) {
        try {
            return await Course.findById(id);
        } catch (error) {
            console.error('Get course by id error:', error);
            throw error;
        }
    }

    async createCourse(courseData) {
        try {
            const course = new Course(courseData);
            return await course.save();
        } catch (error) {
            console.error('Create course error:', error);
            throw error;
        }
    }

    async updateCourse(id, updateData) {
        try {
            return await Course.findByIdAndUpdate(id, updateData, { new: true });
        } catch (error) {
            console.error('Update course error:', error);
            throw error;
        }
    }

    async deleteCourse(id) {
        try {
            return await Course.findByIdAndDelete(id);
        } catch (error) {
            console.error('Delete course error:', error);
            throw error;
        }
    }
}

module.exports = LearnController;