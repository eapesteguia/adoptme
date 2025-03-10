import { config } from "dotenv";

config();

const defaultMode = "dev";

export default {
  app: {
    port: process.env.PORT || 8080,
  },
  db: {
    url: process.env.MONGO_URL,
  },
  mode: process.env.MODE || "dev",
};
