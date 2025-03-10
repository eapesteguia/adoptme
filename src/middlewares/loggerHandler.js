import logger from "../utils/loggers.js";

const loggerHandler = (req, res, next) => {
  req.logger = logger;
  next();
};

export default loggerHandler;
