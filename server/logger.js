const appRoot = require('app-root-path');
const winston = require('winston');
const path = require('path');

// define the custom settings for each transport (file, console)
var options = {
  debug: {
    level: 'debug',
    name: 'debug',
    filename: `${appRoot}/../logs/log.log`,
    handleExceptions: true,
    json: false,
    maxsize: 5242880, // 5MB
    maxFiles: 100,
    colorize: true
  },
  error: {
    level: 'error',
    name: 'error',
    filename: `${appRoot}/../logs/error.log`,
    handleExceptions: true,
    json: false,
    maxsize: 5242880, // 5MB
    maxFiles: 100,
    colorize: true
  },
  console: {
    level: 'debug',
    handleExceptions: true,
    json: false,
    colorize: true
  }
};

// instantiate a new Winston Logger with the settings defined above
var logger = winston.createLogger({
  transports: [
    // new winston.transports.Console(options.console),
    new winston.transports.File(options.debug),
    new winston.transports.File(options.error)
  ],
  exitOnError: false, // do not exit on handled exceptions
});

// create a stream object with a 'write' function that will be used by `morgan`
logger.stream = {
  write: function (message, encoding) {
    // use the 'info' log level so the output will be picked up by both transports (file and console)
    logger.info(message);
  }
};

module.exports = logger;