const express = require('express');
const router = express.Router();

const {
    addBookingVaildators,
    cancelBookingVaildators,
    getBookingByIdVaildators,
} = require('../validators/booking.Validator.js');

const {
    addBooking,
    cancelBooking,
    getBookings,
    getAllBookings,
    getBookingById
} = require('../controllers/booking.controller.js');

const { ProtectedRoters } = require('../controllers/auth.controller.js');
const { ProtectedRotersForStaff, allwedToStaff } = require('../controllers/user.controller.js');

// ======================= [ Customer Routes ] =======================

// Booking a room By Customer
router.post('/', ProtectedRoters, addBookingVaildators, addBooking);

// Canceling a Booking By Customer
router.put('/:id', ProtectedRoters, cancelBookingVaildators, cancelBooking);

// ======================= [ Manager & Receptionist Routes ] =======================

// Get All Bookings (For Manager & Receptionist)
router.get(
    '/',
    ProtectedRotersForStaff,
    allwedToStaff('Manager', 'Receptionist'),
    getBookings
);

// Get Booking By ID (For Owner, Manager, Receptionist)
router.get(
    '/:id',
    ProtectedRotersForStaff,
    allwedToStaff('Owner', 'Manager', 'Receptionist'),
    getBookingByIdVaildators,
    getBookingById
);

// ======================= [ Owner Routes ] =======================

// Get All Bookings (For Owner)
router.get(
    '/owner/all',
    ProtectedRotersForStaff,
    allwedToStaff('Owner'),
    getAllBookings
);

module.exports = router;