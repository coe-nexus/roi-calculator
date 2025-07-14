// config/index.ts
import dotenv from 'dotenv';

dotenv.config();

const isDev = process.env.NODE_ENV === 'development';
const isProd = process.env.NODE_ENV === 'production';

export const config = {
  // Environment
  env: process.env.NODE_ENV || 'development',
  isDev,
  isProd,
  
  // External APIs
  serverApiUrl : isProd
    ? process.env.SERVER_URL || "https://atlas-backend.azurewebsites.net"
    : process.env.LOCAL_SERVER_URL || "http://localhost:8000"
};