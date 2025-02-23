const Booking = require('../models/Booking');

class BookingController {
    async getAllBookings() {
        try {
            return await Booking.find().populate('user');
        } catch (error) {
            console.error('Get all bookings error:', error);
            throw error;
        }
    }

    async getBookingById(id) {
        try {
            return await Booking.findById(id).populate('user');
        } catch (error) {
            console.error('Get booking by id error:', error);
            throw error;
        }
    }

    async createBooking(bookingData) {
        try {
            const booking = new Booking(bookingData);
            return await booking.save();
        } catch (error) {
            console.error('Create booking error:', error);
            throw error;
        }
    }

    async updateBooking(id, updateData) {
        try {
            return await Booking.findByIdAndUpdate(id, updateData, { new: true });
        } catch (error) {
            console.error('Update booking error:', error);
            throw error;
        }
    }

    async deleteBooking(id) {
        try {
            return await Booking.findByIdAndDelete(id);
        } catch (error) {
            console.error('Delete booking error:', error);
            throw error;
        }
    }
}

module.exports = BookingController;