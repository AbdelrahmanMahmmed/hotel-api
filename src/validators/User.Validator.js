const { param, body } = require('express-validator');
const validatorsMiddleware = require('../middlewares/validatormiddleware');
const Hotel = require('../models/hotel.model')
const Staff = require('../models/staff.model')


exports.CreateEmployeeValiadtors = [
    body('name')
        .notEmpty()
        .withMessage('Name is required')
        .isLength({ min: 3 })
        .withMessage('Name must be at least 3 characters long')
        .isLength({ max: 20 })
        .withMessage('Name must be at most 20 characters long')
    ,
    body('email')
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .custom(async (email) => {
            const staff = await Staff.findOne({ email });
            if (staff) {
                throw new Error('Email already exists');
            }
        }),
    body('password')
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),

    body('role')
        .notEmpty()
        .withMessage('Role is required')
        .isIn(['Manager', 'Owner', 'Receptionist', 'Cleaner']),

    body('HotelId')
        .notEmpty()
        .withMessage('HotelId is required')
        .isMongoId()
        .custom(async (HotelId) => {
            const hotel = await Hotel.findById(HotelId);
            if (!hotel) {
                throw new Error('Hotel not found');
            }
            return true;
        }),
    validatorsMiddleware,
];

exports.getEmployeeByIdValiadtors = [
    param('id').isMongoId().withMessage('Invalid User id'),
    validatorsMiddleware,
];

exports.updateEmployeeValiadtors = [
    param('id').isMongoId().withMessage('Invalid User id'),
    body('name')
        .optional()
        .isLength({ min: 3 })
        .withMessage('Name must be at least 3 characters long')
        .isLength({ max: 20 })
        .withMessage('Name must be at most 20 characters long')
    ,
    body('email')
        .optional()
        .isEmail()
        .custom(async (email) => {
            const staff = await Staff.findOne({ email });
            if (staff) {
                throw new Error('Email already exists');
            }
        }),
    body('password')
        .optional()
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),

    body('role')
        .optional()
        .isIn(['Manager', 'Owner', 'Receptionist', 'Cleaner']),

    body('HotelId')
        .optional()
        .isMongoId()
        .custom(async (HotelId) => {
            const hotel = await Hotel.findById(HotelId);
            if (!hotel) {
                throw new Error('Hotel not found');
            }
            return true;
        }),
    validatorsMiddleware,
];

exports.deleteEmployeeValiadtors = [
    param('id').isMongoId().withMessage('Invalid User id'),
    validatorsMiddleware,
];

exports.ChangePasswordValiadtors = [
    body('email')
        .notEmpty()
        .withMessage('Email is required')
        .isEmail(),
    body('NewPassword')
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
    validatorsMiddleware,
];