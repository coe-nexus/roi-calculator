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
    : process.env.LOCAL_SERVER_URL || "http://localhost:8000",
  
  domainId : isProd
    ? process.env.DOMAIN_ID || "1"
    : "1",
  
  tenantId : isProd
    ? process.env.TENANT_ID || "1"
    : "1"
};