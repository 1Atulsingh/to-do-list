// config/db.js

const { Pool } = require('pg'); // Import the Pool class from the pg library

// Create a new pool instance with your database configuration
const pool = new Pool({
    user: process.env.DB_USER, // Database user
    host: process.env.DB_HOST, // Database host (e.g., localhost)
    database: process.env.DB_NAME, // Database name
    password: process.env.DB_PASSWORD, // Database password
    port: process.env.DB_PORT, // Database port (default is 5432 for PostgreSQL)
});

// Export the pool instance for use in other modules
module.exports = pool;