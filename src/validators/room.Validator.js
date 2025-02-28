const { param, body } = require('express-validator');
const validatorsMiddleware = require('../middlewares/validatormiddleware');
const Hotel = require('../models/hotel.model');

// [Owner Validations Controller]
exports.createRoomVaildators = [
    body('hotelId')
        .notEmpty()
        .withMessage('Hotel Id is required')
        .isMongoId()
        .withMessage('Hotel Id is required')
        .custom(async (value, { req }) => {
            const hotel = await Hotel.findById(value);
            if (!hotel) {
                return Promise.reject('Hotel not found');
            }
        }),
    body('roomNumber')
        .notEmpty()
        .withMessage('Room Number is required')
        .isNumeric()
        .withMessage('Room Number must be a number'),

    body('roomType')
        .notEmpty()
        .withMessage('Room Type is required')
        .isIn(['single', 'double', 'suite', 'deluxe'])
        .withMessage('Room Type must be single, double, suite or deluxe'),

    body('floor')
        .notEmpty()
        .withMessage('Floor is required')
        .isNumeric()
        .withMessage('Floor must be a number')
        .isInt({ min: 1 })
        .withMessage('Floor must be greater than 0')
        .isInt({ max: 4 })
        .withMessage('Floor must be between 1 and 4'),

    body('pricePerNight')
        .notEmpty()
        .withMessage('Price Per Night is required')
        .isNumeric()
        .withMessage('Price Per Night must be a number')
        .isInt({ min: 1 })
        .withMessage('Price Per Night must be greater than 0'),

    body('discounts')
        .optional()
        .isNumeric()
        .withMessage('Discounts must be a number'),

    body('availability')
        .optional()
        .isBoolean()
        .withMessage('Availability must be a boolean'),

    body('checkInDate')
        .optional()
        .isDate()
        .withMessage('Check In Date must be a date'),


    body('checkOutDate')
        .optional()
        .isDate()
        .withMessage('Check In Date must be a date'),

    body('bedType')
        .notEmpty()
        .withMessage('Bed Type is required')
        .isIn(['single', 'double', 'queen', 'king'])
        .withMessage('Bed Type must be single, double, queen or king'),

    body('maxOccupancy')
        .notEmpty()
        .withMessage('Max Occupancy is required')
        .isNumeric()
        .withMessage('Max Occupancy must be a number')
        .isInt({ min: 1 })
        .withMessage('Max Occupancy must be greater than 0'),

    body('roomSize')
        .notEmpty()
        .withMessage('Room Size is required')
        .isNumeric()
        .withMessage('Room Size must be a number')
        .isInt({ min: 1 })
        .withMessage('Room Size must be greater than 0'),

    body('bathroomType')
        .notEmpty()
        .withMessage('Bathroom Type is required')
        .isIn(['private', 'shared'])
        .withMessage('Bathroom Type must be private or shared'),

    body('view')
        .notEmpty()
        .withMessage('View is required')
        .isIn(['sea', 'city', 'garden', 'pool'])
        .withMessage('View must be sea, city, garden or pool'),

    body('smokingPolicy')
        .notEmpty()
        .withMessage('Smoking Policy is required')
        .isIn(['allowed', 'not allowed'])
        .withMessage('Smoking Policy must be allowed or not allowed'),

    body('roomAmenities')
        .optional()
        .isArray()
        .withMessage('Room Amenities must be an array')
        .custom((value, { req }) => {
            if (value.length === 0) {
                return Promise.reject('Room Amenities must have at least one value');
            }
            return true;
        }),

    body('reservationStatus')
        .optional()
        .isIn(['confirmed', 'pending', 'cancelled'])
        .withMessage('Reservation Status must be reserved or not reserved'),

    body('specialRequests')
        .optional(),

    body('description')
        .notEmpty()
        .withMessage('Description is required')
        .isString()
        .withMessage('Description must be a string'),

    body('images')
        .custom((_, { req }) => {
            if (!req.files || req.files.length < 1) {
                throw new Error('At least one image is required');
            }
            return true;
        }),

    validatorsMiddleware,
];
exports.getRoomIdVaildators = [
    param('id').isMongoId().withMessage('Invalid User id'),
    validatorsMiddleware,
];
exports.updateRoomVaildators = [
    param('id').isMongoId().withMessage('Invalid User id'),

    body('hotelId')
        .notEmpty()
        .withMessage('Hotel Id is required')
        .isMongoId()
        .withMessage('Hotel Id is required')
        .custom(async (value, { req }) => {
            const hotel = await Hotel.findById(value);
            if (!hotel) {
                return Promise.reject('Hotel not found');
            }
        }),

    body('roomNumber')
        .optional()
        .isNumeric()
        .withMessage('Room Number must be a number'),

    body('roomType')
        .optional()
        .isIn(['single', 'double', 'suite', 'deluxe'])
        .withMessage('Room Type must be single, double, suite or deluxe'),

    body('floor')
        .optional()
        .isNumeric()
        .withMessage('Floor must be a number')
        .isInt({ min: 1 })
        .withMessage('Floor must be greater than 0')
        .isInt({ max: 4 })
        .withMessage('Floor must be between 1 and 4'),

    body('pricePerNight')
        .optional()
        .isNumeric()
        .withMessage('Price Per Night must be a number')
        .isInt({ min: 1 })
        .withMessage('Price Per Night must be greater than 0'),

    body('discounts')
        .optional()
        .isNumeric()
        .withMessage('Discounts must be a number'),

    body('availability')
        .optional()
        .isBoolean()
        .withMessage('Availability must be a boolean'),

    body('checkInDate')
        .optional()
        .isDate()
        .withMessage('Check In Date must be a date'),


    body('checkOutDate')
        .optional()
        .isDate()
        .withMessage('Check In Date must be a date'),

    body('bedType')
        .optional()
        .isIn(['single', 'double', 'queen', 'king'])
        .withMessage('Bed Type must be single, double, queen or king'),

    body('maxOccupancy')
        .optional()
        .isNumeric()
        .withMessage('Max Occupancy must be a number')
        .isInt({ min: 1 })
        .withMessage('Max Occupancy must be greater than 0'),

    body('roomSize')
        .optional()
        .isNumeric()
        .withMessage('Room Size must be a number')
        .isInt({ min: 1 })
        .withMessage('Room Size must be greater than 0'),

    body('bathroomType')
        .optional()
        .isIn(['private', 'shared'])
        .withMessage('Bathroom Type must be private or shared'),

    body('view')
        .optional()
        .isIn(['sea', 'city', 'garden', 'pool'])
        .withMessage('View must be sea, city, garden or pool'),

    body('smokingPolicy')
        .optional()
        .isIn(['allowed', 'not allowed'])
        .withMessage('Smoking Policy must be allowed or not allowed'),

    body('roomAmenities')
        .optional()
        .isArray()
        .withMessage('Room Amenities must be an array')
        .custom((value, { req }) => {
            if (value.length === 0) {
                return Promise.reject('Room Amenities must have at least one value');
            }
            return true;
        }),


    body('reservationStatus')
        .optional()
        .isIn(['reserved', 'not reserved'])
        .withMessage('Reservation Status must be reserved or not reserved'),

    body('specialRequests')
        .optional()
        .isArray()
        .withMessage('Special Requests must be an array'),

    body('description')
        .optional()
        .isString()
        .withMessage('Description must be a string'),

    validatorsMiddleware,
];
exports.DeleteRoomVaildators = [
    param('id').isMongoId().withMessage('Invalid User id'),
    validatorsMiddleware,
];

// [Manager Validations Controller]
exports.createRoomByManagerIdVaildators = [
    body('roomNumber')
        .notEmpty()
        .withMessage('Room Number is required')
        .isNumeric()
        .withMessage('Room Number must be a number'),

    body('roomType')
        .notEmpty()
        .withMessage('Room Type is required')
        .isIn(['single', 'double', 'suite', 'deluxe'])
        .withMessage('Room Type must be single, double, suite or deluxe'),

    body('floor')
        .notEmpty()
        .withMessage('Floor is required')
        .isNumeric()
        .withMessage('Floor must be a number')
        .isInt({ min: 1 })
        .withMessage('Floor must be greater than 0')
        .isInt({ max: 4 })
        .withMessage('Floor must be between 1 and 4'),

    body('pricePerNight')
        .notEmpty()
        .withMessage('Price Per Night is required')
        .isNumeric()
        .withMessage('Price Per Night must be a number')
        .isInt({ min: 1 })
        .withMessage('Price Per Night must be greater than 0'),

    body('discounts')
        .optional()
        .isNumeric()
        .withMessage('Discounts must be a number'),

    body('availability')
        .optional()
        .isBoolean()
        .withMessage('Availability must be a boolean'),

    body('checkInDate')
        .optional()
        .isDate()
        .withMessage('Check In Date must be a date'),


    body('checkOutDate')
        .optional()
        .isDate()
        .withMessage('Check In Date must be a date'),

    body('bedType')
        .notEmpty()
        .withMessage('Bed Type is required')
        .isIn(['single', 'double', 'queen', 'king'])
        .withMessage('Bed Type must be single, double, queen or king'),

    body('maxOccupancy')
        .notEmpty()
        .withMessage('Max Occupancy is required')
        .isNumeric()
        .withMessage('Max Occupancy must be a number')
        .isInt({ min: 1 })
        .withMessage('Max Occupancy must be greater than 0'),

    body('roomSize')
        .notEmpty()
        .withMessage('Room Size is required')
        .isNumeric()
        .withMessage('Room Size must be a number')
        .isInt({ min: 1 })
        .withMessage('Room Size must be greater than 0'),

    body('bathroomType')
        .notEmpty()
        .withMessage('Bathroom Type is required')
        .isIn(['private', 'shared'])
        .withMessage('Bathroom Type must be private or shared'),

    body('view')
        .notEmpty()
        .withMessage('View is required')
        .isIn(['sea', 'city', 'garden', 'pool'])
        .withMessage('View must be sea, city, garden or pool'),

    body('smokingPolicy')
        .notEmpty()
        .withMessage('Smoking Policy is required')
        .isIn(['allowed', 'not allowed'])
        .withMessage('Smoking Policy must be allowed or not allowed'),

    body('roomAmenities')
        .optional()
        .isArray()
        .withMessage('Room Amenities must be an array')
        .custom((value, { req }) => {
            if (value.length === 0) {
                return Promise.reject('Room Amenities must have at least one value');
            }
            return true;
        }),

    body('reservationStatus')
        .optional()
        .isIn(['confirmed', 'pending', 'cancelled'])
        .withMessage('Reservation Status must be reserved or not reserved'),

    body('specialRequests')
        .optional(),

    body('description')
        .notEmpty()
        .withMessage('Description is required')
        .isString()
        .withMessage('Description must be a string'),


    validatorsMiddleware,
];
exports.deleteRoomByManagerIdVaildators = [
    param('id').isMongoId().withMessage('Invalid User id'),
    validatorsMiddleware,
];
exports.getRoomByManagerIdVaildators = [
    param('id').isMongoId().withMessage('Invalid User id'),
    validatorsMiddleware,
];
exports.updateRoomByManagerIdVaildators = [
    param('id').isMongoId().withMessage('Invalid User id'),

    body('roomNumber')
        .optional()
        .isNumeric()
        .withMessage('Room Number must be a number'),

    body('roomType')
        .optional()
        .isIn(['single', 'double', 'suite', 'deluxe'])
        .withMessage('Room Type must be single, double, suite or deluxe'),

    body('floor')
        .optional()
        .isNumeric()
        .withMessage('Floor must be a number')
        .isInt({ min: 1 })
        .withMessage('Floor must be greater than 0')
        .isInt({ max: 4 })
        .withMessage('Floor must be between 1 and 4'),

    body('pricePerNight')
        .optional()
        .isNumeric()
        .withMessage('Price Per Night must be a number')
        .isInt({ min: 1 })
        .withMessage('Price Per Night must be greater than 0'),

    body('discounts')
        .optional()
        .isNumeric()
        .withMessage('Discounts must be a number'),

    body('availability')
        .optional()
        .isBoolean()
        .withMessage('Availability must be a boolean'),

    body('checkInDate')
        .optional()
        .isDate()
        .withMessage('Check In Date must be a date'),


    body('checkOutDate')
        .optional()
        .isDate()
        .withMessage('Check In Date must be a date'),

    body('bedType')
        .optional()
        .isIn(['single', 'double', 'queen', 'king'])
        .withMessage('Bed Type must be single, double, queen or king'),

    body('maxOccupancy')
        .optional()
        .isNumeric()
        .withMessage('Max Occupancy must be a number')
        .isInt({ min: 1 })
        .withMessage('Max Occupancy must be greater than 0'),

    body('roomSize')
        .optional()
        .isNumeric()
        .withMessage('Room Size must be a number')
        .isInt({ min: 1 })
        .withMessage('Room Size must be greater than 0'),

    body('bathroomType')
        .optional()
        .isIn(['private', 'shared'])
        .withMessage('Bathroom Type must be private or shared'),

    body('view')
        .optional()
        .isIn(['sea', 'city', 'garden', 'pool'])
        .withMessage('View must be sea, city, garden or pool'),

    body('smokingPolicy')
        .optional()
        .isIn(['allowed', 'not allowed'])
        .withMessage('Smoking Policy must be allowed or not allowed'),

    body('roomAmenities')
        .optional()
        .isArray()
        .withMessage('Room Amenities must be an array')
        .custom((value, { req }) => {
            if (value.length === 0) {
                return Promise.reject('Room Amenities must have at least one value');
            }
            return true;
        }),

    body('reservationStatus')
        .optional()
        .isIn(['reserved', 'not reserved'])
        .withMessage('Reservation Status must be reserved or not reserved'),

    body('specialRequests')
        .optional()
        .isArray()
        .withMessage('Special Requests must be an array'),

    body('description')
        .optional()
        .isString()
        .withMessage('Description must be a string'),

    validatorsMiddleware,
];

// [Receptionist Validations Controller]
exports.changeRoomStatusVaildators = [
    param('id').isMongoId().withMessage('Invalid User id'),
    body('status')
        .notEmpty()
        .withMessage('Reservation Status is required')
        .isIn(['confirmed', 'pending', 'cancelled'])
        .withMessage('Reservation Status must be reserved or not reserved'),
    validatorsMiddleware,
];
exports.updateRoomDescriptionVaildators = [
    param('id').isMongoId().withMessage('Invalid User id'),
    body('description')
        .notEmpty()
        .withMessage('Description is required')
        .isString()
        .withMessage('Description must be a string'),
    validatorsMiddleware,
];
exports.updateRoomDiscountVaildators = [
    param('id').isMongoId().withMessage('Invalid User id'),
    body('discount')
        .notEmpty()
        .withMessage('Discount is required')
        .isNumeric()
        .withMessage('Discount must be a number')
        .isInt({ min: 1 })
        .withMessage('Discount must be greater than 0')
        .isInt({ max: 100 })
        .withMessage('Discount must be between 1 and 100'),
    validatorsMiddleware,
];
exports.updateRoomAmenitiesVaildators = [
    param('id').isMongoId().withMessage('Invalid User id'),
    body('amenities')
        .notEmpty()
        .withMessage('Room Amenities is required')
        .isArray()
        .withMessage('Room Amenities must be an array')
        .custom((value, { req }) => {
            if (value.length === 0) {
                return Promise.reject('Room Amenities must have at least one value');
            }
            return true;
        }),
    validatorsMiddleware,
];

// [Cleaner Validations Controller]
exports.changeRoomAvailabilityVaildators = [
    param('id').isMongoId().withMessage('Invalid User id'),
    validatorsMiddleware,
];

// [Customer Validations Controller]
exports.checkoutFromRoomVaildators = [
    param('id').isMongoId().withMessage('Invalid User id'),
    validatorsMiddleware,
];
