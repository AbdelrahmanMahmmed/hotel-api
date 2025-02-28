// read file swagger.json
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const path = require('path')
const swaggerDocument = JSON.parse(fs.readFileSync(path.join(__dirname, "../../swagger.json"), "utf8"));

// Import Routes
const authRoutes = require("../routes/auth.route.js");
const userRoutes = require("../routes/user.route.js");
const hotelRoutes = require("../routes/hotel.route.js");
const roomRoutes = require("../routes/room.route.js");
const bookingRoutes = require("../routes/booking.route.js");
const paymentRoutes = require("../routes/payment.route.js");
const analysisRoutes = require("../routes/analysis.router.js");

module.exports = (app) => {
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
};