const Booking = require('../models/booking');

class BookingController {
  async createBooking(req, res) {
    try {
      const booking = new Booking({
        userId: req.user._id,
        ...req.body
      });
      await booking.save();
      res.status(201).json({ success: true, booking });
    } catch (error) {
      res.status(500).json({ error: 'Failed to create booking' });
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