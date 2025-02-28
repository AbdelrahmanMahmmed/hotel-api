const { json } = require('express');
const Booking = require('../models/booking.model.js');
const Payment = require('../models/payment.model.js');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Hotel = require('../models/hotel.model.js');
const User = require('../models/user.model.js');
const asyncHandler = require('express-async-handler')

// [Customer Controllers]

// Process Payment
exports.processPayment = asyncHandler(async (req, res) => {
    try {
        const { paymentMethodId, booking: bookingId } = req.body;

        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ success: false, message: "Booking not found" });
        }

        const paymentIntent = await stripe.paymentIntents.create({
            amount: booking.totalPrice * 100,
            currency: 'usd',
            payment_method: paymentMethodId,
            confirm: true
        });

        const payment = new Payment({
            hotel: booking.hotel,
            room: booking.room,
            booking: booking._id,
            paymentMethod: 'online',
            amount: booking.totalPrice * 100,
            transactionId: paymentIntent.id,
            paymentDate: new Date(),
            status: paymentIntent.status === "succeeded" ? "completed" : "failed"
        });

        await payment.save();

        const user = await User.findById(booking.user);
        if (paymentIntent.status === "succeeded") {
            booking.paymentStatus = "paid";
            user.Payments.push(payment);
            // Send Email
            const message = `
                Hello ${user.name},
                
                Your payment for booking ${booking._id} has been confirmed.
                Your booking details:
                - Check-in: ${booking.checkInDate}
                - Check-out: ${booking.checkOutDate}
                - Room: ${booking.room}
                - Total price: ${booking.totalPrice}
                
                Kindly contact our customer service at 123-456-7890 to make any changes or confirm your payment.
                
                Thank you for choosing us.
            `;
            try {
                await SendEmail({
                    to: user.email,
                    subject: 'Payment Confirmation',
                    text: message
                });
            } catch (err) {
                console.error("Error while sending email:", err);
                return next(new ApiError('Failed to send email, please try again later', 500));
            }
        } else {
            booking.paymentStatus = "failed";
            return res.status(400).json({
                success: false,
                message: "Payment failed. Please try again or use another payment method.",
            });
        }

        await booking.save();
        await user.save();

        res.json({ success: true, message: "Payment successful", payment });

    } catch (error) {
        if (error.type === 'StripeCardError') {
            return res.status(400).json({ success: false, message: "Payment failed: " + error.message });
        }
        res.status(500).json({ success: false, message: "Server error: " + error.message });
    }
});

// Request Cancellation
exports.requestCancellation = asyncHandler(async (req, res) => {
    try {
        const { bookingId } = req.body;

        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ success: false, message: "Booking not found" });
        }

        if (booking.paymentStatus === "paid") {
            return res.status(400).json({ success: false, message: "Cannot cancel a paid booking. Please contact support." });
        }

        booking.status = "cancelled";
        await booking.save();

        res.json({ success: true, message: "Cancellation request submitted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// View all payments (successful & failed) for Owner
exports.getPayments = asyncHandler(async (req, res) => {
    const { _id: staffId, role } = req.staff;

    if (role !== 'Owner') {
        return res.status(403).json({ success: false, message: "Unauthorized role" });
    }
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const payments = await Payment.find()
        .sort({ paymentDate: -1 })
        .skip(skip)
        .limit(parseInt(limit));

    const totalPayments = await Payment.countDocuments();

    if (!payments.length) {
        return res.status(404).json({ success: false, message: "No payments found" });
    }

    res.json({
        success: true,
        totalPages: Math.ceil(totalPayments / limit),
        currentPage: parseInt(page),
        totalPayments,
        payments
    });
});


// View all payments (successful & failed) for Manager & Receptionist
exports.getStaffPayments = asyncHandler(async (req, res) => {
    const { _id: staffId, role: staffRole } = req.staff;

    let hotelQuery = staffRole === 'Manager' ? { managerId: staffId } : { staffsIds: { $in: [staffId] } };

    const hotel = await Hotel.findOne(hotelQuery);
    if (!hotel) {
        return res.status(404).json({ success: false, message: "Hotel not found" });
    }

    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const payments = await Payment.find({ hotel: hotel._id })
        .sort({ paymentDate: -1 })
        .skip(skip)
        .limit(parseInt(limit));

    const totalPayments = await Payment.countDocuments({ hotel: hotel._id });

    if (payments.length === 0) {
        return res.status(404).json({ success: false, message: "No payments found" });
    }

    res.json({
        success: true,
        totalPages: Math.ceil(totalPayments / limit),
        currentPage: parseInt(page),
        totalPayments,
        payments
    });
});