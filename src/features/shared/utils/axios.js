// src/features/shared/utils/axios.js

import axios from 'axios';
import { API_BASE_URL } from '../constants/api';
import { getSecureSessionStorage, clearSecureSessionStorage } from '../../auth/services/encryptionService';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Obtiene el token de forma segura desde almacenamiento encriptado o normal
 */
const getAuthToken = () => {
  // Intentar obtener desde almacenamiento encriptado
  const secureToken = getSecureSessionStorage('token');
  if (secureToken) return secureToken;
  
  // Fallback a sessionStorage normal para compatibilidad
  return sessionStorage.getItem('token');
};

/**
 * Limpia el token de ambos almacenamientos
 */
const clearAuthToken = () => {
  clearSecureSessionStorage('token');
  clearSecureSessionStorage('user');
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('user');
  sessionStorage.removeItem('_ek'); // Limpiar clave de encriptación
};

// Interceptor para agregar token en cada request
api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de respuesta (401/403)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Token expirado o no autorizado
      clearAuthToken();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
