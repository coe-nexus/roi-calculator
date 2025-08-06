import axios from 'axios';
import { TenantRead } from './types';

const isDev = import.meta.env.DEV;
const isProd = import.meta.env.PROD;

console.log(`isDev: ${isDev} isProd: ${isProd}`)

// Base configuration without tenant
export const config = {
  env: import.meta.env.MODE || 'development',
  isDev,
  isProd,
  serverApiUrl: isProd
    ? import.meta.env.VITE_SERVER_URL || "https://atlas-backend.azurewebsites.net/api/v1"
    : import.meta.env.VITE_LOCAL_SERVER_URL || "http://localhost:8000/api/v1",
  tenant: null as TenantRead | null,
  defaultDomainIndex: 0
};

// Create apiClient using config
export const apiClient = axios.create({
    baseURL: config.serverApiUrl,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Tenant fetching function
const getTenant = async () => {
  try {
    const tenant_name = config.isProd
      ? window.location.hostname.split('.')[0]
      : "dimash";
      
    const response = await apiClient.get('tenants', {
      params: { tenant_name }
    });

    console.log("Connected to tenant", response.data)
    
    return response.data as TenantRead;
  } catch (e) {
    console.error("An error occured while looking up the tenant by name: ", e);
    return null;
  }
}

// Function to initialize config with tenant
export const initializeConfig = async () => {
  const tenant = await getTenant();
  config.tenant = tenant;
  return config;
}

// Optional: Create a promise that resolves when config is ready
export const configReady = initializeConfig();