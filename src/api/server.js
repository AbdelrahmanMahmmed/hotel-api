const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');
const listEndpoints = require('express-list-endpoints');
const DBconnection = require('../config/db.js');
const ApiError = require('../utils/APIError.js');
const globalError = require('../middlewares/errormiddleware.js');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const swaggerDocument = JSON.parse(fs.readFileSync(path.join(__dirname, "../../swagger.json"), "utf8"));

// Load environment variables
dotenv.config({ path: 'config.env' });

const app = express();
const PORT = process.env.PORT || 5000;

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

// Load routers
const authRoutes = require("../routes/auth.route.js");
const userRoutes = require("../routes/user.route.js");
const hotelRoutes = require("../routes/hotel.route.js");
const roomRoutes = require("../routes/room.route.js");
const bookingRoutes = require("../routes/booking.route.js");
const paymentRoutes = require("../routes/payment.route.js");
const analysisRoutes = require("../routes/analysis.router.js");

// Define a basic welcome route
app.get("/", (req, res) => {
    res.send("Welcome to My Hotel API!");
});
// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/hotel", hotelRoutes);
app.use("/api/v1/room", roomRoutes);
app.use("/api/v1/booking", bookingRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/analysis", analysisRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Print all endpoints for testing purposes
const endpoints = listEndpoints(app).map(endpoint => ({
    path: endpoint.path,
    methods: endpoint.methods
})).slice(0, -1);

// Handle unknown routes
app.all('*', (req, res, next) => {
    next(new ApiError(`No route found for: ${req.originalUrl}`, 404));
});

// Global error handler
app.use(globalError);

// Prevent multiple server instances
if (!module.parent) {
    const server = app.listen(PORT, () => {
        console.log(`App is running on port ${PORT}`);
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err) => {
        console.error(`Unhandled Rejection: ${err.name} | ${err.message}`);
        server.close(() => {
            process.exit(1);
        });
    });
}

module.exports = app;