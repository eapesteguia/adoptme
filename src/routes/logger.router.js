import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  const logs = [];

  logs.push("Fatal(0): ejemplo de FATAL... ");
  req.logger.fatal(`Ejemplo de error fatal en /loggerTest...`);

  logs.push("Error(1): ejemplo de ERROR... ");
  req.logger.error(`Ejemplo de error en /loggerTest...`);

  logs.push("Warning(2): ejemplo de WARNING... ");
  req.logger.warning(`Ejemplo de warning en /loggerTest...`);

  logs.push("Info(3): ejemplo de INFO... ");
  req.logger.info(`Ejemplo de info en /loggerTest...`);

  logs.push("Http(4): ejemplo de HTTP... ");
  req.logger.http(`Ejemplo de error http en /loggerTest...`);

  logs.push("Debug(5): ejemplo de DEBUG... ");
  req.logger.debug(`Ejemplo de debug en /loggerTest...`);

  res.status(200).json({
    status: "success",
    message:
      "Search for this example logs in the server console under DEV mode or in file errors.log under PROD mode",
    logs,
  });
});

export default router;
