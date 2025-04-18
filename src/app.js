import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUiExpress from "swagger-ui-express";
import swaggerOptions from "./utils/swaggerDocs.js";

import config from "./config/config.js";
import errorHandler from "./middlewares/errorHandler.js";
import loggerHandler from "./middlewares/loggerHandler.js";
import logger from "./utils/loggers.js";

import usersRouter from "./routes/users.router.js";
import petsRouter from "./routes/pets.router.js";
import adoptionsRouter from "./routes/adoption.router.js";
import sessionsRouter from "./routes/sessions.router.js";
import mocksRouter from "./routes/mocks.routers.js";
import loggerRouter from "./routes/logger.router.js";

const app = express();
const PORT = config.app.port;
const MONGO = config.db.url;
const connection = mongoose.connect(MONGO);
logger.info(`Now running ${config.mode} environment`);

app.use(express.json());
app.use(cookieParser());
app.use(loggerHandler);

const specs = swaggerJSDoc(swaggerOptions);
app.use("/apidocs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs));

app.use("/api/users", usersRouter);
app.use("/api/pets", petsRouter);
app.use("/api/adoptions", adoptionsRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/api/mocks", mocksRouter);
app.use("/api/loggerTest", loggerRouter);

app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`Up! Listening on ${PORT}`);
});
