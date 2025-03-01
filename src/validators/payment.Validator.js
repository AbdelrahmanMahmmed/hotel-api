const { param, body } = require('express-validator');
const validatorsMiddleware = require('../middlewares/validatormiddleware');
const Staff = require('../models/staff.model');

exports.processPaymentVaildators = [
    body('paymentMethodId')
        .notEmpty()
        .withMessage('Payment Method Id is required')
        .isString()
        .withMessage('Payment Method Id should be a string'),
        
    body('booking')
        .notEmpty()
        .withMessage('Booking is required')
        .isMongoId()
        .withMessage('Booking should be a valid MongoDB ObjectId'),
    validatorsMiddleware,
];
exports.requestCancellationVaildators = [
    body('bookingId')
        .notEmpty()
        .withMessage('Booking is required')
        .isMongoId()
        .withMessage('Booking should be a valid MongoDB ObjectId'),
    validatorsMiddleware,
];