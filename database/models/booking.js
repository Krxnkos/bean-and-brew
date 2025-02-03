const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
    userId: String,
    firstName: String,
    location: {
        type: String,
        required: true,
        enum: ['Leeds', 'Harrogate', 'Knaresborough Castle']
    },
    date: {
        type: Date,
        required: true
    },
    time: String,
    guests: {
        type: Number,
        required: true,
        min: 1,
        max: 8
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled'],
        default: 'pending'
    }
}, { timestamps: true });

module.exports = mongoose.models.Booking || mongoose.model('Booking', BookingSchema);