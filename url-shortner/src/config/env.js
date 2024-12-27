import * as dotenv from "dotenv";
dotenv.config();

export const PORT = parseInt(process.env.PORT, 10) || 3000;

//Redis Credentials
export const REDIS_URI = process.env.REDIS_URI;

//Others
export const JWT_SECRET = process.env.JWT_SECRET || "";
export const EMAIL = process.env.EMAIL;
export const NODE_ENV = process.env.NODE_ENV;

//Database
export const DB_HOST = process.env.DB_HOST;
export const DB_USER = process.env.DB_USER;
export const DB_PASSWORD = process.env.DB_PASSWORD;
export const DB_NAME = process.env.DB_NAME;

//Google Cloud Console
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
export const CALLBACK_URL = process.env.CALLBACK_URL;
export const SESSION_SECRET = process.env.SESSION_SECRET;

//Rate Limit
export const MAX_REQUESTS = process.env.MAX_REQUESTS;
export const RATE_LIMIT_WINDOW = process.env.RATE_LIMIT_WINDOW;
