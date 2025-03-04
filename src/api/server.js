const PORT = process.env.PORT || 5000;

// Load app
const app = require('./app');
// Connect to database
const DBconnection = require('../config/db.js');
DBconnection();

// Print all endpoints for testing purposes with express-list-endpoints libaray
const listEndpoints = require('express-list-endpoints');
const endpoints = listEndpoints(app).map(endpoint => ({
    path: endpoint.path,
    methods: endpoint.methods
})).slice(0, -1);

// console.log(endpoints);

// Start the server
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

module.exports = server;