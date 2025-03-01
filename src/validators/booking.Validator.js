const { param, body } = require('express-validator');
const validatorsMiddleware = require('../middlewares/validatormiddleware');
const Room = require('../models/room.model');


exports.addBookingVaildators = [
    body('room')
        .notEmpty()
        .withMessage('Room ID is required')
        .isMongoId()
        .withMessage('Room ID is required')
        .custom(async (value) => {
            const room = await Room.findById(value);
            if (!room) {
                return Promise.reject('Room not found');
            }
        }),

    body('checkInDate')
        .notEmpty()
        .withMessage('Check-in date is required')
        .isDate()
        .withMessage('Check-in date is not valid'),

    body('checkOutDate')
        .notEmpty()
        .withMessage('Check-out date is required')
        .isDate()
        .withMessage('Check-out date is not valid'),

    body('guests')
        .notEmpty()
        .withMessage('Guests is required')
        .isNumeric()
        .withMessage('Guests must be a number'),

    body('price')
        .notEmpty()
        .withMessage('Price is required')
        .isNumeric()
        .withMessage('Price must be a number'),

    body('status')
        .notEmpty()
        .withMessage('Status is required')
        .isIn(['pending', 'confirmed', 'cancelled', 'completed'])
        .withMessage('Status must be one of Pending, Confirmed, Canceled'),

    body('NumberOfDays')
        .notEmpty()
        .withMessage('Number of days is required')
        .isNumeric()
        .withMessage('Number of days must be a number'),

    body('paymentStatus')
        .notEmpty()
        .withMessage('Payment status is required')
        .isIn(['pending', 'paid', 'failed'])
        .withMessage('Payment status must be one of Pending, Completed , Failed'),
    validatorsMiddleware,
];

exports.cancelBookingVaildators = [
    param('id')
        .notEmpty()
        .withMessage('User ID is required')
        .isMongoId()
        .withMessage('User ID is not valid'),
    validatorsMiddleware,
];

exports.getBookingByIdVaildators = [
    param('id')
        .notEmpty()
        .withMessage('User ID is required')
        .isMongoId()
        .withMessage('User ID is not valid'),
    validatorsMiddleware,
];