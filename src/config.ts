// Remove dotenv import - not needed in Vite
const isDev = import.meta.env.DEV;
const isProd = import.meta.env.PROD;

export const config = {
  // Environment
  env: import.meta.env.MODE || 'development',
  isDev,
  isProd,
  
  // External APIs
  serverApiUrl: isProd
    ? import.meta.env.VITE_SERVER_URL || "https://atlas-backend.azurewebsites.net/api/v1"
    : import.meta.env.VITE_LOCAL_SERVER_URL || "http://localhost:8000/api/v1",
  
  domainId: isProd
    ? import.meta.env.VITE_DOMAIN_ID || "1"
    : "1",
  
  tenantId: isProd
    ? import.meta.env.VITE_TENANT_ID || "1" 
    : "1",
  
  guestUID: import.meta.env.VITE_GUEST_UID || "2"
};