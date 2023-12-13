import { config } from "dotenv";
config();

/* Environment Configuration */

export const NODE_ENV = process.env.NODE_ENV;
export const PORT = process.env.PORT;
export const FRONTEND_URL_DEVELOPMENT = process.env.FRONTEND_URL_DEVELOPMENT;
export const FRONTEND_URL_PRODUCTION = process.env.FRONTEND_URL_PRODUCTION;
export const BACKEND_URL_DEVELOPMENT = process.env.BACKEND_URL_DEVELOPMENT;
export const BACKEND_URL_PRODUCTION = process.env.BACKEND_URL_PRODUCTION;
export const PAYPAL_API = "https://api-m.sandbox.paypal.com";

/* MongoDB Configuration */

export const MONGO_USER = process.env.MONGO_USER;
export const MONGO_PASSWORD = process.env.MONGO_PASSWORD;
export const MONGO_DATABASE = process.env.MONGO_DATABASE;
export const MONGO_CLUSTER = process.env.MONGO_CLUSTER;

/* Cloudinary Credentials */

export const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
export const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;

/* Paypal Credentials */

export const PAYPAL_API_CLIENT = process.env.PAYPAL_API_CLIENT;
export const PAYPAL_API_SECRET = process.env.PAYPAL_API_SECRET;

/* JWT Authentication Configuration */

export const JWT_SECRET = process.env.JWT_SECRET;
