// src/features/pedidos/pages/PedidosFormPage.jsx

import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Navbar } from '../../shared/components/Navbar';
import { Alert } from '../../shared/components/Alert';
import { usePedidos } from '../hooks/usePedidos';
import { formatters } from '../../shared/utils/validators';

export const PedidosFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { createPedido, updatePedido, fetchPedidoById } = usePedidos();

  const [formData, setFormData] = useState({
    id: null, // Se mantiene null para crear, se asigna para editar
    numeroPedido: '',
    cliente: '',
    total: 0,
    estado: 'pendiente',
  });

  // Fecha se mantiene separada solo para mostrar en UI, no se envía al API
  const [fechaDisplay, setFechaDisplay] = useState('');

  const [errors, setErrors] = useState({});
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Cargar datos si es edición
  useEffect(() => {
    if (id) {
      const loadPedido = async () => {
        try {
          const pedido = await fetchPedidoById(id);
          setFormData({
            id: pedido.id, // Guardar el id del pedido
            numeroPedido: pedido.numeroPedido || '',
            cliente: pedido.cliente || '',
            total: pedido.total || 0,
            estado: pedido.estado || 'pendiente',
          });
          // Mostrar fecha en formato legible solo para edición
          setFechaDisplay(formatters.formatDate(pedido.fecha, 'DD/MM/YYYY') || '');
        } catch {
          setSubmitError('Error al cargar el pedido');
        }
      };
      loadPedido();
    }
  }, [id, fetchPedidoById]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.cliente.trim()) {
      newErrors.cliente = 'El nombre del cliente es requerido';
    }

    if (formData.total <= 0) {
      newErrors.total = 'El total debe ser mayor a 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value,
    }));
    // Limpiar error del campo al escribir
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    if (!validateForm()) {
      return;
    }

    // Prevenir múltiples envíos
    if (submitLoading) {
      return;
    }

    setSubmitLoading(true);

    try {
      if (id) {
        // Actualizar - incluir el id en los datos enviados al API
        const updateData = {
          ...formData,
          id: formData.id, // Asegurar que el id va en los datos
        };
        await updatePedido(id, updateData);
        setSuccessMessage('Pedido actualizado correctamente');
      } else {
        // Crear - NO incluir el id en los datos
        const createData = {
          numeroPedido: formData.numeroPedido,
          cliente: formData.cliente,
          total: formData.total,
          estado: formData.estado,
        };
        await createPedido(createData);
        setSuccessMessage('Pedido creado correctamente');
      }

      // NO resetear submitLoading, mantenerlo en true hasta navigar
      setTimeout(() => {
        navigate('/pedidos');
      }, 1500);
    } catch (err) {
      setSubmitError(err.message || 'Error al guardar el pedido');
      setSubmitLoading(false); // Solo resetear en error
    }
  };

  const isEditing = !!id;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {isEditing ? 'Editar Pedido' : 'Nuevo Pedido'}
          </h1>
          <p className="text-gray-600 mt-2">
            {isEditing ? 'Actualiza los detalles del pedido' : 'Crea un nuevo pedido completando el formulario'}
          </p>
        </div>

        {/* Alerts */}
        {successMessage && (
          <Alert
            message={successMessage}
            type="success"
            onClose={() => setSuccessMessage('')}
          />
        )}

        {submitError && (
          <Alert
            message={submitError}
            type="error"
            onClose={() => setSubmitError('')}
            autoClose={false}
          />
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-8 space-y-6">
          {/* Número de pedido */}
          <div>
            <label htmlFor="numeroPedido" className="block text-sm font-medium text-gray-700 mb-2">
              Número de pedido *
            </label>
            <input
              id="numeroPedido"
              type="text"
              name="numeroPedido"
              value={formData.numeroPedido}
              onChange={handleChange}
              placeholder="Ej: P2026-1"
              disabled={submitLoading}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${errors.numeroPedido ? 'border-red-500' : 'border-gray-300'
                }`}
            />
            {errors.numeroPedido && (
              <p className="text-red-600 text-sm mt-1">{errors.numeroPedido}</p>
            )}
          </div>
          {/* Cliente */}
          <div>
            <label htmlFor="cliente" className="block text-sm font-medium text-gray-700 mb-2">
              Nombre del Cliente *
            </label>
            <input
              id="cliente"
              type="text"
              name="cliente"
              value={formData.cliente}
              onChange={handleChange}
              placeholder="Ej: Juan Pérez"
              disabled={submitLoading}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${errors.cliente ? 'border-red-500' : 'border-gray-300'
                }`}
            />
            {errors.cliente && (
              <p className="text-red-600 text-sm mt-1">{errors.cliente}</p>
            )}
          </div>

          {/* Fecha y Total */}
          <div className="grid grid-cols-1 gap-6">
            {/* Fecha */}
            <div hidden={isEditing ? false : true}>
              <label htmlFor="fecha" className="block text-sm font-medium text-gray-700 mb-2">
                Fecha
              </label>
              <input
                id="fecha"
                type="text"
                disabled={true}
                value={fechaDisplay}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
              />
            </div>

            {/* Total */}
            <div>
              <label htmlFor="total" className="block text-sm font-medium text-gray-700 mb-2">
                Total (USD) *
              </label>
              <input
                id="total"
                type="number"
                name="total"
                value={formData.total}
                onChange={handleChange}
                placeholder="0.00"
                min="0.01"
                step="0.01"
                disabled={submitLoading}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${errors.total ? 'border-red-500' : 'border-gray-300'
                  }`}
              />
              {errors.total && (
                <p className="text-red-600 text-sm mt-1">{errors.total}</p>
              )}
            </div>
          </div>

          {/* Estado */}
          <div>
            <label htmlFor="estado" className="block text-sm font-medium text-gray-700 mb-2">
              Estado
            </label>
            <select
              id="estado"
              name="estado"
              value={formData.estado}
              onChange={handleChange}
              disabled={submitLoading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            >
              <option value="pendiente">Pendiente</option>
              <option value="procesando">Procesando</option>
              <option value="completado">Completado</option>
              <option value="cancelado">Cancelado</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate('/pedidos')}
              disabled={submitLoading}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition duration-200 disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitLoading}
              className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-200 disabled:opacity-50"
            >
              {submitLoading ? 'Guardando...' : isEditing ? 'Actualizar' : 'Crear Pedido'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
