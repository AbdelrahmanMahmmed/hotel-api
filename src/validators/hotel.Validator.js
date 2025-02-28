const { param, body } = require('express-validator');
const validatorsMiddleware = require('../middlewares/validatormiddleware');
const Staff = require('../models/staff.model');

exports.AddHotelVaildators = [
    body('name')
        .notEmpty()
        .withMessage('Name is required')
        .isLength({ min: 3 })
        .withMessage('Name must be at least 3 characters long')
        .isLength({ max: 20 })
        .withMessage('Name must be at most 20 characters long'),

    body('location')
        .notEmpty()
        .withMessage('location is required'),

    body('description')
        .notEmpty()
        .withMessage('description is required')
        .isLength({ min: 20 })
        .withMessage('description must be at least 20 characters long')
        .isLength({ max: 500 })
        .withMessage('description must be at most 500 characters long'),

    body('images')
        .custom((_, { req }) => {
            if (!req.files || req.files.length < 1) {
                throw new Error('At least one image is required');
            }
            return true;
        }),

    body('rating')
        .notEmpty()
        .withMessage('rating is required')
        .isInt({ min: 0, max: 5 })
        .withMessage('Rating must be an integer between 0 and 5'),

    body('pricePerNight')
        .notEmpty()
        .withMessage('pricePerNight is required'),

    body('amenities')
        .isArray()
        .notEmpty()
        .withMessage('amenities is required'),
    validatorsMiddleware,
];

exports.getHotelByIdValiadtors = [
    param('id').isMongoId().withMessage('Invalid User id'),
    validatorsMiddleware,
];

exports.updateHotelValiadtors = [
    param('id').isMongoId().withMessage('Invalid User id'),
    body('name')
        .optional()
        .isLength({ min: 3 })
        .withMessage('Name must be at least 3 characters long')
        .isLength({ max: 20 })
        .withMessage('Name must be at most 20 characters long'),

    body('location')
        .optional(),

    body('description')
        .optional()
        .isLength({ min: 20 })
        .withMessage('description must be at least 20 characters long')
        .isLength({ max: 500 })
        .withMessage('description must be at most 500 characters long'),

    body('rating')
        .optional()
        .isInt({ min: 0, max: 5 })
        .withMessage('Rating must be an integer between 0 and 5'),

    body('pricePerNight')
        .optional(),

    body('amenities')
        .isArray()
        .optional(),

    body('managerId')
        .optional()
        .isMongoId()
        .withMessage('Invalid managerId format')
        .custom(async (managerId) => {
            const staff = await Staff.findById(managerId);
            if (!staff) {
                throw new Error('User not found');
            }
            if (staff.role !== 'Manager') {
                throw new Error('Provided ID does not belong to a Manager');
            }
            return true;
        }),
    validatorsMiddleware,
];

exports.deleteHotelValiadtors = [
    param('id').isMongoId().withMessage('Invalid User id'),
    validatorsMiddleware,
];