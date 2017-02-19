import winston from 'winston';

const logger = new winston.Logger({
  transports: [
    new winston.transports.Console({ timestamp: true, colorize: true, level: 'debug' }),
    new winston.transports.File({ filename: './logs/api.log', level: 'verbose' }),
  ],
});

module.exports = logger;
