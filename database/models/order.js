const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    userId: String,
    firstName: String,
    items: [{
        name: String,
        quantity: Number,
        price: Number,
        category: String
    }],
    total: Number,
    status: {
        type: String,
        enum: ['pending', 'completed', 'cancelled'],
        default: 'pending'
    }
}, { timestamps: true });

module.exports = mongoose.models.Order || mongoose.model('Order', OrderSchema);