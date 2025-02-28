const express = require('express');
const router = express.Router();

// const {
//     AddHotelVaildators,
//     getHotelByIdValiadtors,
//     updateHotelValiadtors,
//     deleteHotelValiadtors,
// } = require('../validators/hotel.Validator.js');

const {
    processPayment,        // for Customer
    requestCancellation,   // for Customer
    getPayments,           // for Owner
    getStaffPayments       // for Manager & Receptionist
} = require('../controllers/payment.controller.js');

const { ProtectedRotersForStaff, allwedToStaff } = require('../controllers/user.controller.js');
const { ProtectedRoters } = require('../controllers/auth.controller.js');


// [Customer Routers]

// Checkout payment
router
    .route('/checkout')
    .post(ProtectedRoters, processPayment);

// Request Cancellation of a Booking By Customer After Payment
router
    .route('/request-cancellation')
    .post(ProtectedRoters, requestCancellation);

// [Owner Routers]
router
    .route('/owner/payments')
    .get(
        ProtectedRotersForStaff,
        allwedToStaff('Owner'),
        getPayments
    );

// [Manager & Receptionist Routers]
router
    .route('/staff/payments')
    .get(
        ProtectedRotersForStaff,
        allwedToStaff('Manager', 'Receptionist'),
        getStaffPayments
    );
module.exports = router;