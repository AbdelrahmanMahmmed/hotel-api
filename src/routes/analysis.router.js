const express = require('express');
const router = express.Router();

const {
    getAnalyticsPayment
} = require('../controllers/reports.analytics.controller.js');

const { ProtectedRotersForStaff, allwedToStaff } = require('../controllers/user.controller.js');

// Get analytics payment data
router
    .route('/totalAmount')
    .get(
        ProtectedRotersForStaff,
        allwedToStaff('Owner'),
        getAnalyticsPayment
    );

module.exports = router;