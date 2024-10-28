const env = require('./env');

module.exports = {
    logger: {
        directory: env.logDir,
        level: env.logLevel,
        maxSize: '20m',
        maxFiles: '14d',
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true
    }
};