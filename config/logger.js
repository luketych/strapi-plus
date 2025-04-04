const winston = require('winston');
const path = require('path');
const fs = require('fs');

// Ensure logs directory exists
const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

const customLogger = {
  http: 3,
  info: 2,
  debug: 5,
  warn: 1,
  error: 0,
  fatal: 0,
};

module.exports = {
  levelFilter: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
  transports: [
    new winston.transports.Console({
      level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.prettyPrint()
      )
    }),
    new winston.transports.File({
      filename: path.join(process.cwd(), 'logs', 'strapi.log'),
      level: 'debug',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
      maxsize: 10485760, // 10MB
      maxFiles: 10
    })
  ],
  levels: customLogger,
};
