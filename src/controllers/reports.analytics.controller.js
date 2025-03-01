const Payment = require('../models/payment.model.js');
const asyncHandler = require('express-async-handler')
const ApiError = require('../utils/ApiError');

// Get Total in amount in all PaymentModel
exports.getAnalyticsPayment = asyncHandler(async (req, res, next) => {
    try {
        const result = await Payment.aggregate([
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: "$amount" }
                }
            }
        ]);

        const totalAmount = result.length > 0 ? result[0].totalAmount : 0;

        res.json({ totalAmount });
    } catch (error) {
        next(new ApiError('Server Error', 500));
    }
});