const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');

// Load environment variables
dotenv.config({ path: 'config.env' });

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Enable logging in development mode
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
    console.log(`Running in ${process.env.NODE_ENV} mode`);
}

require('./routers')(app);

// Handle unknown routes
const ApiError = require('../utils/APIError.js');
app.all('*', (req, res, next) => {
    next(new ApiError(`No route found for: ${req.originalUrl}`, 404));
});

// Global error handler
const globalError = require('../middlewares/errormiddleware.js');
app.use(globalError);

module.exports = app;