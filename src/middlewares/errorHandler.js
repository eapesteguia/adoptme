import { error_types } from "../utils/error_types.js"; // diccionario de errores

const errorHandler = (error, req, res, next) => {
  // puedo mandar un mail o hacer el log del error
  if (error.code) {
    // si existe el error.code significa que fue generado por el CustomError class
    console.log(error.message);
    console.log(error.cause);
    res.setHeader("Content-Type", "application/json");
    return res.status(500).json({ error: `Internal server error` });
  } else {
    console.log(error);
    res.setHeader("Content-Type", "application/json");
    return res
      .status(500)
      .json({ error: `Internal server error / with error handler` });
  }
};

export default errorHandler;
