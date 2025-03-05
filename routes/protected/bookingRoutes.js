const express = require('express');
const AuthMiddleware = require('../../middleware/authMiddleware');
const BookingController = require('../../database/controllers/bookingController');

class BookingRoutes {
    constructor() {
        this.router = express.Router();
        this.controller = new BookingController();
        this.initRoutes();
    }

    initRoutes() {
        // Public route for the booking page
        this.router.get('/', this.renderBookingPage.bind(this));
        
        // Protected routes
        this.router.post('/', AuthMiddleware.authenticate, AuthMiddleware.validateBooking(), this.createBooking.bind(this));
        this.router.get('/list', AuthMiddleware.authenticate, this.getAllBookings.bind(this));
        this.router.get('/:id', AuthMiddleware.authenticate, this.getBookingById.bind(this));
        this.router.post('/:id/cancel',
            AuthMiddleware.authenticate,
            async (req, res) => {
                try {
                    const booking = await Booking.findById(req.params.id);
                    
                    if (!booking) {
                        return res.status(404).json({
                            success: false,
                            message: 'Booking not found'
                        });
                    }

                    if (booking.userId.toString() !== req.user._id.toString()) {
                        return res.status(403).json({
                            success: false,
                            message: 'Not authorized to cancel this booking'
                        });
                    }

                    booking.status = 'cancelled';
                    await booking.save();

                    res.json({
                        success: true,
                        message: 'Booking cancelled successfully'
                    });
                } catch (error) {
                    console.error('Cancel booking error:', error);
                    res.status(500).json({
                        success: false,
                        message: 'Failed to cancel booking'
                    });
                }
            }
        );
    }

    renderBookingPage(req, res) {
        res.render('booking/booking', {
            user: req.session?.user || null,
            userType: req.cookies?.userType || null
        });
    }

    async createBooking(req, res) {
        try {
            const booking = await this.controller.createBooking(req.body);
            res.status(201).json(booking);
        } catch (error) {
            console.error('Create booking error:', error);
            res.status(500).json({ message: 'Error creating booking' });
        }
    }

    async getAllBookings(req, res) {
        try {
            const bookings = await this.controller.getAllBookings();
            res.json(bookings);
        } catch (error) {
            console.error('Get bookings error:', error);
            res.status(500).json({ message: 'Error fetching bookings' });
        }
    }

    async getBookingById(req, res) {
        try {
            const booking = await this.controller.getBookingById(req.params.id);
            if (!booking) {
                return res.status(404).json({ message: 'Booking not found' });
            }
            res.json(booking);
        } catch (error) {
            console.error('Get booking error:', error);
            res.status(500).json({ message: 'Error fetching booking' });
        }
    }

    getRouter() {
        return this.router;
    }
}

module.exports = new BookingRoutes().getRouter();