const mongoose = require('mongoose');

const SessionSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    availableSpots: {
        type: Number,
        required: true
    }
});

const CourseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: String,
    location: {
        type: String,
        required: true,
        enum: ['Leeds', 'Harrogate', 'Knaresborough Castle']
    },
    duration: Number,
    price: Number,
    maxParticipants: {
        type: Number,
        default: 6
    },
    sessions: [SessionSchema]
}, { timestamps: true });

module.exports = mongoose.models.Course || mongoose.model('Course', CourseSchema);