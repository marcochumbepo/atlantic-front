// src/features/pedidos/hooks/usePedidos.js

import { useState, useCallback } from 'react';
import { pedidosService } from '../services/pedidosService';

export const usePedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPedidos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await pedidosService.getAll();
      setPedidos(data);
    } catch (err) {
      setError(err.message || 'Error al cargar pedidos');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPedidoById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const data = await pedidosService.getById(id);
      return data;
    } catch (err) {
      setError(err.message || 'Error al cargar el pedido');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createPedido = useCallback(async (pedidoData) => {
    setError(null);
    try {
      const newPedido = await pedidosService.create(pedidoData);
      setPedidos((prev) => [...prev, newPedido]);
      return newPedido;
    } catch (err) {
      setError(err.message || 'Error al crear el pedido');
      throw err;
    }
  }, []);

  const updatePedido = useCallback(async (id, pedidoData) => {
    setError(null);
    try {
      const updated = await pedidosService.update(id, pedidoData);
      setPedidos((prev) =>
        prev.map((p) => (p.id === id ? updated : p))
      );
      return updated;
    } catch (err) {
      setError(err.message || 'Error al actualizar el pedido');
      throw err;
    }
  }, []);

  const deletePedido = useCallback(async (id) => {
    setError(null);
    try {
      await pedidosService.delete(id);
      setPedidos((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      setError(err.message || 'Error al eliminar el pedido');
      throw err;
    }
  }, []);

  return {
    pedidos,
    loading,
    error,
    fetchPedidos,
    fetchPedidoById,
    createPedido,
    updatePedido,
    deletePedido,
  };
};
