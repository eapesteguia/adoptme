import winston from "winston";
import config from "../config/config.js";

const customLevels = {
  levels: {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3,
    http: 4,
    debug: 5,
  },
  colors: {
    fatal: "red",
    error: "magenta",
    warning: "yellow",
    info: "blue",
    http: "white",
    debug: "cyan",
  },
};

const logger = winston.createLogger({
  levels: customLevels.levels,
  transports: [
    new winston.transports.File({
      level: "info",
      filename: "./src/logs/errors.log",
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
    }),
  ],
});

const consoleTransport = new winston.transports.Console({
  level: "debug",
  format: winston.format.combine(
    winston.format.colorize({ colors: customLevels.colors }),
    winston.format.timestamp(),
    winston.format.simple()
  ),
});

// Si estoy en el modo dev, agrego el transporte de consola
if (config.mode == "dev") {
  logger.add(consoleTransport);
}

export default logger;
