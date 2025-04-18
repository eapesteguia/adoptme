import __dirname from "./index.js";
import { dirname } from "path";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Adoptme API Documentation",
      version: "1.0.0",
      description: "API documentation for Adoptme application",
    },
    servers: [
      {
        url: "http://localhost:8080",
        description: "Development server",
      },
    ],
  },
  apis: [`${dirname(__dirname)}/docs/*.yaml`],
};

export default swaggerOptions;
