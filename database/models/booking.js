const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
    userId: String,
    firstName: String,
    type: {
        type: String,
        enum: ['table', 'course'],
        required: true,
        default: 'course' // Add a default value
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    },
    courseName: String,
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
    guests: Number,
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled'],
        default: 'pending'
    }
}, { timestamps: true });

module.exports = mongoose.models.Booking || mongoose.model('Booking', BookingSchema);