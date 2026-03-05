// src/features/auth/services/encryptionService.js

import CryptoJS from 'crypto-js';

/**
 * Clave de encriptación derivada del navegador/dispositivo
 * En producción, esta clave puede obtenerse de una API segura o
 * generarse usando datos del dispositivo para que sea única por navegador
 */
const getEncryptionKey = () => {
  // Opción 1: Usar una clave fija (menos segura, pero simple)
  // En producción, considerar opciones más robustas
  const DEFAULT_KEY = 'atlantic-orders-2024-secure-key';
  
  // Opción 2 (Recomendada): Obtener clave del localStorage si existe,
  // sino generar una basada en el dispositivo
  let key = sessionStorage.getItem('_ek');
  
  if (!key) {
    // Generar una clave única basada en datos del navegador
    const browserData = navigator.userAgent + navigator.language + new Date().getFullYear();
    key = CryptoJS.SHA256(browserData).toString().substring(0, 32);
    sessionStorage.setItem('_ek', key);
  }
  
  return key;
};

/**
 * Encripta un texto usando AES-256
 * @param {string} text - Texto a encriptar
 * @returns {string} Texto encriptado en formato Base64
 */
export const encryptText = (text) => {
  if (!text) return '';
  
  try {
    const key = getEncryptionKey();
    const encrypted = CryptoJS.AES.encrypt(text, key).toString();
    return encrypted;
  } catch (error) {
    console.error('Error encriptando texto:', error);
    throw new Error('No se pudo encriptar los datos');
  }
};

/**
 * Desencripta un texto previamente encriptado
 * @param {string} encryptedText - Texto encriptado
 * @returns {string} Texto desencriptado
 */
export const decryptText = (encryptedText) => {
  if (!encryptedText) return '';
  
  try {
    const key = getEncryptionKey();
    const decrypted = CryptoJS.AES.decrypt(encryptedText, key).toString(CryptoJS.enc.Utf8);
    return decrypted;
  } catch (error) {
    console.error('Error desencriptando texto:', error);
    throw new Error('No se pudo desencriptar los datos');
  }
};

/**
 * Encripta un objeto de credenciales (email y password)
 * @param {Object} credentials - Objeto con email y password
 * @returns {Object} Objeto con credenciales encriptadas
 */
export const encryptCredentials = (credentials) => {
  try {
    return {
      email: encryptText(credentials.email),
      password: encryptText(credentials.password),
    };
  } catch (error) {
    console.error('Error encriptando credenciales:', error);
    throw new Error('No se pudo encriptar las credenciales');
  }
};

/**
 * Desencripta un objeto de credenciales
 * @param {Object} encryptedCredentials - Objeto con credenciales encriptadas
 * @returns {Object} Objeto con credenciales desencriptadas
 */
export const decryptCredentials = (encryptedCredentials) => {
  try {
    return {
      email: decryptText(encryptedCredentials.email),
      password: decryptText(encryptedCredentials.password),
    };
  } catch (error) {
    console.error('Error desencriptando credenciales:', error);
    throw new Error('No se pudo desencriptar las credenciales');
  }
};

/**
 * Encripta datos para almacenar en sessionStorage de forma segura
 * @param {string} key - Clave para sessionStorage
 * @param {any} value - Valor a almacenar
 */
export const setSecureSessionStorage = (key, value) => {
  try {
    const jsonString = JSON.stringify(value);
    const encrypted = encryptText(jsonString);
    sessionStorage.setItem(key, encrypted);
  } catch (error) {
    console.error('Error almacenando datos seguros:', error);
    throw new Error('No se pudo almacenar los datos de forma segura');
  }
};

/**
 * Desencripta y obtiene datos de sessionStorage
 * @param {string} key - Clave de sessionStorage
 * @returns {any} Valor desencriptado
 */
export const getSecureSessionStorage = (key) => {
  try {
    const encrypted = sessionStorage.getItem(key);
    if (!encrypted) return null;
    
    const decrypted = decryptText(encrypted);
    return JSON.parse(decrypted);
  } catch (error) {
    console.error('Error obteniendo datos seguros:', error);
    return null;
  }
};

/**
 * Limpia datos sensibles del sessionStorage
 * @param {string} key - Clave de sessionStorage a limpiar
 */
export const clearSecureSessionStorage = (key) => {
  try {
    sessionStorage.removeItem(key);
  } catch (error) {
    console.error('Error limpiando sessionStorage:', error);
  }
};

/**
 * Genera un hash SHA-256 de una contraseña (para verificación local)
 * @param {string} password - Contraseña a hashear
 * @returns {string} Hash de la contraseña
 */
export const hashPassword = (password) => {
  return CryptoJS.SHA256(password).toString();
};

export const encryptionService = {
  encryptText,
  decryptText,
  encryptCredentials,
  decryptCredentials,
  setSecureSessionStorage,
  getSecureSessionStorage,
  clearSecureSessionStorage,
  hashPassword,
};
