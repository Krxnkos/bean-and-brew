const { Router } = require('express');
const { requireAuth } = require('../../middleware/authMiddleware');
const bookingController = require('../../database/controllers/bookingController');
const { check, validationResult } = require('express-validator');

class BookingRoutes {
    constructor() {
        this.router = Router();
        this.initRoutes();
    }

    validateBooking() {
        return [
            check('location')
                .isIn(['Leeds', 'Harrogate', 'Knaresborough Castle'])
                .withMessage('Invalid location'),
            check('date')
                .isDate()
                .withMessage('Valid date is required'),
            check('time')
                .matches(/^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/)
                .withMessage('Valid time is required'),
            check('guests')
                .isInt({ min: 1, max: 8 })
                .withMessage('Number of guests must be between 1 and 8'),
            (req, res, next) => {
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    return res.redirect('/booking?error=' + encodeURIComponent(errors.array()[0].msg));
                }
                next();
            }
        ];
    }

    initRoutes() {
        this.router.get('/booking', requireAuth, (req, res) => {
            res.render('booking/booking', { 
                user: req.user,
                error: req.query.error 
            });
        });

        this.router.post('/booking', requireAuth, this.validateBooking(), async (req, res) => {
            try {
                const bookingData = {
                    userId: req.user.firstName,
                    firstName: req.user.firstName,
                    type: 'table',
                    location: req.body.location,
                    date: req.body.date,
                    time: req.body.time,
                    guests: parseInt(req.body.guests),
                    status: 'pending'
                };

                await bookingController.createBooking(bookingData);
                res.redirect('/my-bookings');
            } catch (error) {
                console.error('Route booking error:', error);
                res.redirect('/booking?error=Failed to create booking');
            }
        });

        this.router.get('/my-bookings', requireAuth, async (req, res) => {
            try {
                const bookings = await bookingController.getBookings(req.user.firstName);
                res.render('booking/my-bookings', { 
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