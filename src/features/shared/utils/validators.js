// src/features/shared/utils/validators.js

/**
 * Validadores reutilizables para formularios
 */

export const validators = {
  /**
   * Valida si el email tiene formato correcto
   * @param {string} email 
   * @returns {boolean}
   */
  isValidEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  /**
   * Valida que un campo no esté vacío
   * @param {string} value 
   * @returns {boolean}
   */
  isRequired: (value) => {
    return value && value.trim().length > 0;
  },

  /**
   * Valida que un número sea mayor a cero
   * @param {number} value 
   * @returns {boolean}
   */
  isPositive: (value) => {
    return Number(value) > 0;
  },

  /**
   * Valida longitud mínima
   * @param {string} value 
   * @param {number} minLength 
   * @returns {boolean}
   */
  minLength: (value, minLength) => {
    return value && value.length >= minLength;
  },

  /**
   * Valida longitud máxima
   * @param {string} value 
   * @param {number} maxLength 
   * @returns {boolean}
   */
  maxLength: (value, maxLength) => {
    return !value || value.length <= maxLength;
  },

  /**
   * Valida que sea un número
   * @param {any} value 
   * @returns {boolean}
   */
  isNumber: (value) => {
    return !isNaN(parseFloat(value)) && isFinite(value);
  },
};

/**
 * Formateadores de datos
 */
export const formatters = {
  /**
   * Formatea fecha a formato local
   * @param {Date|string} date 
   * @returns {string}
   */
  formatDate: (date, format = 'YYYY-MM-DD') => {
    const d = new Date(date);

    const map = {
      YYYY: d.getFullYear(),
      MM: String(d.getMonth() + 1).padStart(2, '0'),
      DD: String(d.getDate()).padStart(2, '0'),
    };

    return format.replace(/YYYY|MM|DD/g, (matched) => map[matched]);
  },

  /**
   * Formatea moneda USD
   * @param {number} value 
   * @returns {string}
   */
  formatCurrency: (value) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  },

  /**
   * Formatea número con decimales
   * @param {number} value 
   * @param {number} decimals 
   * @returns {string}
   */
  formatNumber: (value, decimals = 2) => {
    return parseFloat(value).toFixed(decimals);
  },

  /**
   * Acorta texto largo
   * @param {string} text 
   * @param {number} length 
   * @returns {string}
   */
  truncate: (text, length = 50) => {
    return text.length > length ? text.substring(0, length) + '...' : text;
  },
};
