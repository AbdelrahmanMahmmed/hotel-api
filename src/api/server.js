const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');
const listEndpoints = require('express-list-endpoints');
const DBconnection = require('../config/db.js');
const ApiError = require('../utils/APIError.js');
const globalError = require('../middlewares/errormiddleware.js');

// Load environment variables
dotenv.config({ path: 'config.env' });

const app = express();
const PORT = process.env.PORT || 5000;
let server;

// Connect to database
DBconnection();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Enable logging in development mode
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
    console.log(`Running in ${process.env.NODE_ENV} mode`);
}


// Print all endpoints for testing purposes
const endpoints = listEndpoints(app).map(endpoint => ({
    path: endpoint.path,
    methods: endpoint.methods
})).slice(0, -1);

// console.log(endpoints);

// Handle unknown routes
app.all('*', (req, res, next) => {
    next(new ApiError(`No route found for: ${req.originalUrl}`, 404));
});

// Global error handler
app.use(globalError);

// Start the server if not already running
if (!server) {
    server = app.listen(PORT, () => {
        console.log(`App is running on port ${PORT}`);
    });
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error(`Unhandled Rejection: ${err.name} | ${err.message}`);
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    } else {
        process.exit(1);
    }
});

module.exports = server;