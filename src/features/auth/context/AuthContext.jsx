// src/features/auth/context/AuthContext.jsx

import React, { createContext, useCallback, useEffect, useReducer } from 'react';
import { 
  getSecureSessionStorage, 
  setSecureSessionStorage,
  clearSecureSessionStorage 
} from '../services/encryptionService';

const AuthContext = createContext();

const initialState = {
  user: null,
  token: null,
  loading: true,
  error: null,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'INIT_AUTH':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        loading: false,
      };
    case 'LOGIN':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        error: null,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        error: null,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
      };
    default:
      return state;
  }
};

const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Inicializar desde almacenamiento seguro
  useEffect(() => {
    try {
      // Intentar obtener desde almacenamiento encriptado
      const secureToken = getSecureSessionStorage('token');
      const secureUser = getSecureSessionStorage('user');
      
      // Fallback a sessionStorage normal para compatibilidad
      const token = secureToken || sessionStorage.getItem('token');
      const user = secureUser || (sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user')) : null);
      
      dispatch({
        type: 'INIT_AUTH',
        payload: {
          token,
          user,
        },
      });
    } catch (error) {
      console.error('Error inicializando autenticación:', error);
      dispatch({
        type: 'INIT_AUTH',
        payload: {
          token: null,
          user: null,
        },
      });
    }
  }, []);

  const login = useCallback((userData, tokenData) => {
    try {
      // Almacenar de forma segura (encriptado)
      setSecureSessionStorage('token', tokenData);
      setSecureSessionStorage('user', userData);
      
      // También guardar sin encriptar para compatibilidad con otros servicios
      sessionStorage.setItem('token', tokenData);
      sessionStorage.setItem('user', JSON.stringify(userData));
      
      dispatch({
        type: 'LOGIN',
        payload: { user: userData, token: tokenData },
      });
    } catch (error) {
      console.error('Error durante login:', error);
      dispatch({
        type: 'SET_ERROR',
        payload: 'Error al almacenar credenciales de forma segura',
      });
    }
  }, []);

  const logout = useCallback(() => {
    try {
      // Limpiar almacenamiento seguro
      clearSecureSessionStorage('token');
      clearSecureSessionStorage('user');
      sessionStorage.removeItem('_ek'); // Limpiar clave de encriptación
      
      // Limpiar sessionStorage normal
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
      
      dispatch({ type: 'LOGOUT' });
    } catch (error) {
      console.error('Error durante logout:', error);
    }
  }, []);

  const setAuthError = useCallback((errorMessage) => {
    dispatch({
      type: 'SET_ERROR',
      payload: errorMessage,
    });
  }, []);

  const value = {
    user: state.user,
    token: state.token,
    loading: state.loading,
    error: state.error,
    login,
    logout,
    setAuthError,
    isAuthenticated: !!state.token,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
