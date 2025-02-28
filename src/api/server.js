const cluster = require('cluster');
const os = require('os');

const numCPUs = os.cpus().length;
const PORT = process.env.PORT || 5000;

if (cluster.isMaster) {
    console.log(`Master process ${process.pid} is running`);

    // Fork workers based on CPU cores
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    // Restart worker if it crashes
    cluster.on('exit', (worker) => {
        console.log(`Worker ${worker.process.pid} died. Spawning a new one...`);
        cluster.fork();
    });

} else {
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
        console.log(`Worker ${process.pid} is running on port ${PORT}`);
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err) => {
        console.error(`Unhandled Rejection: ${err.name} | ${err.message}`);
        server.close(() => {
            process.exit(1);
        });
    });
}