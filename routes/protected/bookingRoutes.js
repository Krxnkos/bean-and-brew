const { Router } = require('express');
const { requireAuth, validateBooking } = require('../../middleware/authMiddleware');
const bookingController = require('../../database/controllers/bookingController');

class BookingRoutes {
    constructor() {
        this.router = Router();
        this.initRoutes();
    }

    initRoutes() {
        this.router.post('/booking', [
            requireAuth,
            validateBooking(),
            async (req, res) => {
                try {
                    const bookingData = {
                        userId: req.user.firstName,
                        firstName: req.user.firstName,
                        location: req.body.location,
                        date: req.body.date,
                        time: req.body.time,
                        guests: parseInt(req.body.guests),
                        status: 'confirmed'
                    };
    
                    await bookingController.createBooking(bookingData);
                    res.redirect('/my-bookings');
                } catch (error) {
                    console.error('Booking creation error:', error);
                    res.status(500).redirect('/booking?error=Failed to create booking');
                }
            }
        ]);

        this.router.get('/my-bookings', requireAuth, async (req, res) => {
            try {
                const bookings = await bookingController.getBookings(req.user.firstName);
                res.render('my-bookings', { 
                    user: req.user,
                    bookings,
                    error: req.query.error
                });
            } catch (error) {
                res.redirect('/my-bookings?error=Failed to fetch bookings');
            }
        });

        this.router.post('/booking/:id/cancel', requireAuth, async (req, res) => {
            try {
                await bookingController.cancelBooking(req.params.id, req.user.firstName);
                res.json({ success: true });
            } catch (error) {
                res.status(500).json({ error: 'Failed to cancel booking' });
            }
        });
    }
}

module.exports = new BookingRoutes().router;