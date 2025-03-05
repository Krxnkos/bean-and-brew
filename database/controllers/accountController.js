const User = require('../models/User');
const Booking = require('../models/Booking');
const Order = require('../models/order');
const Course = require('../models/Course');

class AccountController {
    async getUserData(userId) {
        try {
            const [bookings, orders, courseEnrollments] = await Promise.all([
                Booking.find({ userId }).sort({ date: -1 }).lean(),
                Order.find({ userId }).sort({ createdAt: -1 }).lean(),
                Course.find({ 
                    'sessions.enrolledUsers': userId 
                }).lean()
            ]);

            return {
                bookings,
                orders,
                courses: courseEnrollments
            };
        } catch (error) {
            console.error('Get user data error:', error);
            throw error;
        }
    }
}

module.exports = AccountController;