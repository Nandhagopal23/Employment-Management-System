const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const routes = require('./routes');
app.use('/api', routes); // Prefix all routes with /api

// Basic Route
app.get('/', (req, res) => {
    res.json({ message: 'EMS Server is running.' });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    // console.error(err.stack); // Keep stack trace for debugging if needed

    if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({
            error: 'Database Validation Error',
            messages: err.errors.map(e => e.message)
        });
    }

    if (err.isJoi) { // Should be caught by middleware, but safeguard
        return res.status(400).json({
            error: 'Validation Error',
            messages: err.details.map(d => d.message)
        });
    }

    res.status(500).json({
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
});

module.exports = app;
