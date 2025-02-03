const Booking = require('../models/booking');

class BookingController {
    async createBooking(bookingData) {
        try {
            const booking = new Booking({
                userId: bookingData.userId,
                firstName: bookingData.firstName,
                location: bookingData.location,
                date: bookingData.date,
                time: bookingData.time,
                guests: parseInt(bookingData.guests),
                status: 'pending'
            });

            await booking.save();
            return booking;
        } catch (error) {
            console.error('Booking creation error:', error);
            throw error;
        }
    }

    async getBookings(firstName) {
        return await Booking.find({ firstName }).sort({ createdAt: -1 });
    }

    async cancelBooking(bookingId, firstName) {
        const booking = await Booking.findOneAndUpdate(
            { _id: bookingId, firstName: firstName },
            { 
                status: 'cancelled',
                cancelledAt: new Date()
            },
            { new: true }
        );
        
        if (!booking) {
            throw new Error('Booking not found');
        }
        
        return booking;
    }
}

module.exports = new BookingController();