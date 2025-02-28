const mongoose = require('mongoose');

const paymentModel = new mongoose.Schema({
    hotel:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hotel',
        required: true,
    },
    room:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room',
        required: true,
    },
    booking: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking',
        required: true,
    },
    paymentMethod: {
        type: String,
        enum: ['online', 'cash'],
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    transactionId: {
        type: String,
        required: true,
    },
    paymentDate: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        enum: ['completed', 'failed'],
        required: true,
    }
}, { timestamps: true });

const Payment = mongoose.model('Payment', paymentModel);

module.exports = Payment;