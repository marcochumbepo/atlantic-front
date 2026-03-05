// src/features/auth/services/authService.js

import api from '../../shared/utils/axios';
import { API_ENDPOINTS } from '../../shared/constants/api';
import { 
  setSecureSessionStorage, 
  getSecureSessionStorage,
  clearSecureSessionStorage 
} from './encryptionService';

export const authService = {
  /**
    * Realiza login con credenciales en plaintext
    * Las credenciales se transmiten vía HTTPS (encriptado en tránsito)
    * @param {string} email - Email del usuario
    * @param {string} password - Contraseña del usuario
    * @returns {Promise} Respuesta del servidor
    */
  login: async (email, password) => {
    try {
      // ¡IMPORTANTE! NO encriptamos las credenciales aquí.
      // El backend espera email y password en plaintext.
      // La encriptación en tránsito se proporciona mediante HTTPS.
      // La encriptación de almacenamiento ocurre después del login en el context.
      
      const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, {
        email: email,
        password: password,
      });
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al iniciar sesión' };
    }
  },

  /**
   * Realiza logout eliminando token y datos de usuario
   */
  logout: () => {
    clearSecureSessionStorage('token');
    clearSecureSessionStorage('user');
    sessionStorage.removeItem('_ek'); // Limpiar clave de encriptación
  },

  /**
   * Obtiene el token de forma segura (desencriptado)
   * @returns {string} Token del usuario
   */
  getToken: () => {
    // Intentar obtener desde almacenamiento seguro
    const secureToken = getSecureSessionStorage('token');
    if (secureToken) return secureToken;
    
    // Fallback a sessionStorage normal para compatibilidad
    return sessionStorage.getItem('token');
  },

  /**
   * Obtiene el usuario de forma segura (desencriptado)
   * @returns {Object} Datos del usuario
   */
  getUser: () => {
    // Intentar obtener desde almacenamiento seguro
    const secureUser = getSecureSessionStorage('user');
    if (secureUser) return secureUser;
    
    // Fallback a sessionStorage normal para compatibilidad
    const user = sessionStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  /**
   * Almacena token de forma segura (encriptado)
   * @param {string} token - Token a almacenar
   */
  setToken: (token) => {
    setSecureSessionStorage('token', token);
    // También guardar en sessionStorage sin encriptar para compatibilidad
    sessionStorage.setItem('token', token);
  },

  /**
   * Almacena datos de usuario de forma segura (encriptados)
   * @param {Object} user - Datos del usuario
   */
  setUser: (user) => {
    setSecureSessionStorage('user', user);
    // También guardar en sessionStorage sin encriptar para compatibilidad
    sessionStorage.setItem('user', JSON.stringify(user));
  },

  /**
   * Verifica si el usuario está autenticado
   * @returns {boolean} True si está autenticado
   */
  isAuthenticated: () => {
    return !!(getSecureSessionStorage('token') || sessionStorage.getItem('token'));
  },
};
