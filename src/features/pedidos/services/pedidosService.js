// src/features/pedidos/services/pedidosService.js

import api from '../../shared/utils/axios';
import { API_ENDPOINTS } from '../../shared/constants/api';

export const pedidosService = {
  getAll: async () => {
    try {
      const response = await api.get(API_ENDPOINTS.PEDIDOS.GET_ALL);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al obtener pedidos' };
    }
  },

  getById: async (id) => {
    try {
      const response = await api.get(API_ENDPOINTS.PEDIDOS.GET_ONE(id));
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al obtener el pedido' };
    }
  },

  create: async (pedido) => {
    try {
      const response = await api.post(API_ENDPOINTS.PEDIDOS.CREATE, pedido);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al crear el pedido' };
    }
  },

  update: async (id, pedido) => {
    try {
      const response = await api.put(API_ENDPOINTS.PEDIDOS.UPDATE(id), pedido);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al actualizar el pedido' };
    }
  },

  delete: async (id) => {
    try {
      const response = await api.delete(API_ENDPOINTS.PEDIDOS.DELETE(id));
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al eliminar el pedido' };
    }
  },
};
