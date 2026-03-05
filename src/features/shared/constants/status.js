// src/features/shared/constants/status.js

/**
 * Estados posibles de un pedido
 */
export const PEDIDO_STATUS = {
  PENDIENTE: 'pendiente',
  PROCESANDO: 'procesando',
  COMPLETADO: 'completado',
  CANCELADO: 'cancelado',
};

/**
 * Mapeo de estados con colores y etiquetas
 */
export const STATUS_CONFIG = {
  [PEDIDO_STATUS.PENDIENTE]: {
    label: 'Pendiente',
    color: 'bg-yellow-100 text-yellow-800',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
  },
  [PEDIDO_STATUS.PROCESANDO]: {
    label: 'Procesando',
    color: 'bg-blue-100 text-blue-800',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
  },
  [PEDIDO_STATUS.COMPLETADO]: {
    label: 'Completado',
    color: 'bg-green-100 text-green-800',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
  },
  [PEDIDO_STATUS.CANCELADO]: {
    label: 'Cancelado',
    color: 'bg-red-100 text-red-800',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
  },
};

/**
 * Tipos de alertas
 */
export const ALERT_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
};

/**
 * Mensajes de error estándar
 */
export const ERROR_MESSAGES = {
  REQUIRED_FIELD: 'Este campo es requerido',
  INVALID_EMAIL: 'El email no es válido',
  INVALID_NUMBER: 'Ingresa un número válido',
  GREATER_THAN_ZERO: 'Debe ser mayor a 0',
  NETWORK_ERROR: 'Error de conexión. Intenta de nuevo.',
  UNAUTHORIZED: 'Credenciales inválidas',
  FORBIDDEN: 'No tienes permisos para esta acción',
  NOT_FOUND: 'El recurso no fue encontrado',
  SERVER_ERROR: 'Error en el servidor. Intenta más tarde.',
};

/**
 * Mensajes de éxito estándar
 */
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Sesión iniciada correctamente',
  PEDIDO_CREATED: 'Pedido creado correctamente',
  PEDIDO_UPDATED: 'Pedido actualizado correctamente',
  PEDIDO_DELETED: 'Pedido eliminado correctamente',
};
