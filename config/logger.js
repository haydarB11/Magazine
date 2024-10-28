const winston = require('winston');
require('winston-daily-rotate-file');
const appConfig = require('./appConfig');

const transport = new winston.transports.DailyRotateFile({
    filename: `${appConfig.logger.directory}/api-%DATE%.log`,
    datePattern: appConfig.logger.datePattern,
    zippedArchive: appConfig.logger.zippedArchive,
    maxSize: appConfig.logger.maxSize,
    maxFiles: appConfig.logger.maxFiles
});

const logger = winston.createLogger({
    level: appConfig.logger.level,
    format: winston.format.combine(
        winston.format.colorize({ all: true }),
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [transport],
});

module.exports = logger;