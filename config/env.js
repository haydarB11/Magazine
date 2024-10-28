const dotenv = require('dotenv');

dotenv.config();

module.exports = {
    port: process.env.PORT || 8000,
    logDir: process.env.LOG_DIR || 'logs',
    logLevel: process.env.LOG_LEVEL || 'info'
};