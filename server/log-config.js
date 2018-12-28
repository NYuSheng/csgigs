const { createLogger, format, transports } = require("winston");
const { combine, timestamp, label, printf } = format;
require("winston-daily-rotate-file");

const logFormat = printf(info => {
  return `${info.timestamp} [${info.label}] ${info.level}: ${info.message}`;
});

const applicationLogger = createLogger({
  exitOnError: false,
  format: combine(
    label({ label: "CS.Gigs Admin" }),
    timestamp({ format: "YYYY-MM-DDThh:mm:ss" }),
    logFormat
  ),
  transports: [
    new transports.DailyRotateFile({
      filename: "./logs/application-%DATE%.log",
      datePattern: "YYYY-MM-DD-HH",
      zippedArchive: true,
      maxSize: "5m",
      maxFiles: "14d"
    })
  ]
});

const accessLogger = createLogger({
  exitOnError: false,
  transports: [
    new transports.DailyRotateFile({
      filename: "./logs/access-%DATE%.log",
      datePattern: "YYYY-MM-DD-HH",
      zippedArchive: true,
      maxSize: "5m",
      maxFiles: "14d"
    })
  ]
});

module.exports = applicationLogger;
module.exports.stream = {
  write: message => {
    accessLogger.info(message);
  }
};
