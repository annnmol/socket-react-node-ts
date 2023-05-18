import dotenv from "dotenv";
dotenv.config();

const MONGO_USERNAME = process.env.MONGO_USERNAME || "";
const MONGO_PASSWORD = process.env.MONGO_PASSWORD || "";

const MONGO_URL = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@anmol.keynylf.mongodb.net/?retryWrites=true&w=majority`;

const SERVER_PORT = process.env.PORT ? Number(process.env.PORT) : 5000;

export const SERVER_CONFIG = {
  MONGO: {
    URL: MONGO_URL,
  },
  SERVER: {
    PORT: SERVER_PORT,
  },
};
