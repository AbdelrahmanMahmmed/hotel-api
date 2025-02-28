const Payment = require('../models/payment.model.js');
const asyncHandler = require('express-async-handler')


// Get Total in amount in all PaymentModel
exports.getAnalyticsPayment = asyncHandler ( async (req , res)=> {
    try {
        const totalAmount = await Payment.find().sum('amount');
        res.json({ totalAmount });
    } catch (error) {
        throw new ApiError('Server Error', 500);
    }
});