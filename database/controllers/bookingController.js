const Booking = require('../models/booking');

class BookingController {
  async createBooking(bookingData) {
    try {
      // Log the incoming data
      console.log('Creating booking with data:', bookingData);

      // Ensure type is set
      if (!bookingData.type) {
        throw new Error('Booking type must be specified');
      }

      const booking = new Booking({
        ...bookingData,
        type: bookingData.type // Ensure type is copied over
      });

      const savedBooking = await booking.save();
      console.log('Booking created:', savedBooking);
      return savedBooking;
    } catch (error) {
      console.error('Booking creation error:', error);
      throw error;
    }
  }

  async getBookings(req, res) {
    try {
      const bookings = await Booking.find({ userId: req.user._id });
      res.status(200).json({ bookings });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch bookings' });
    }
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