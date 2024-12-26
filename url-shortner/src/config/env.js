import * as dotenv from "dotenv";
dotenv.config();

export const PORT = parseInt(process.env.PORT, 10) || 3000;

//Mongo Credentials
export const MONGO_URI = process.env.MONGO_URI || "";

//Others
export const JWT_SECRET = process.env.JWT_SECRET || "";
export const EMAIL = process.env.EMAIL;
export const NODE_ENV = process.env.NODE_ENV;

//Database
export const DB_HOST = process.env.DB_HOST;
export const DB_USER = process.env.DB_USER;
export const DB_PASSWORD = process.env.DB_PASSWORD;
export const DB_NAME = process.env.DB_NAME;
