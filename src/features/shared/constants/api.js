// src/features/shared/constants/api.js

const isDev = import.meta.env.DEV;
const API_PROD_URL = 'https://api.atlantic.yourserver.com';
const API_DEV_URL = 'http://localhost:8080';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (isDev ? API_DEV_URL : API_PROD_URL);

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: 'api/auth/login',
  },
  PEDIDOS: {
    GET_ALL: '/api/pedidos',
    GET_ONE: (id) => `/api/pedidos/${id}`,
    CREATE: '/api/pedidos',
    UPDATE: (id) => `/api/pedidos/${id}`,
    DELETE: (id) => `/api/pedidos/${id}`,
  },
};
