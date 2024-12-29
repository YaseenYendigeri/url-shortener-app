import {
  DB_HOST,
  DB_PASSWORD,
  DB_USER,
  DB_NAME,
  DB_PORT,
  PORT,
} from "#src/config/env";
export default {
  HOST: DB_HOST,
  USER: DB_USER,
  PASSWORD: DB_PASSWORD,
  DB: DB_NAME,
  PORT: DB_PORT,
  dialect: "postgres",
  pool: {
    max: 20,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
};
