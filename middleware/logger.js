const logger = require('../config/logger');

const logRequests = (req, res, next) => {
    const startTime = Date.now();

    const originalEnd = res.end;

    res.end = function (...args) {
        const duration = Date.now() - startTime;
        const userId = req.user ? req.user.id : 'Anonymous';

        const logMessage = `${new Date().toISOString()} - ${req.method} ${req.originalUrl} - User ID: ${userId}`;

        logger.info(logMessage, {
            timestamp: new Date().toISOString(),
            method: req.method,
            url: req.originalUrl,
            statusCode: res.statusCode,
            duration: `${duration}ms`,
            ip: req.ip,
            userId: userId
        });

        originalEnd.apply(this, args);
    };

    next();
};

module.exports = logRequests;