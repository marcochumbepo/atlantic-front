// src/features/pedidos/components/PedidoCard.jsx

import React from 'react';
import { Link } from 'react-router-dom';

export const PedidoCard = ({ pedido, onDelete }) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('es-ES');
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'PEN',
    }).format(value);
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      'pendiente': 'bg-yellow-100 text-yellow-800',
      'procesando': 'bg-blue-100 text-blue-800',
      'completado': 'bg-green-100 text-green-800',
      'cancelado': 'bg-red-100 text-red-800',
    };
    return statusMap[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow p-6 hover:shadow-lg transition duration-200">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Pedido #{pedido.numeroPedido}
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            {formatDate(pedido.fechaCreacion || new Date())}
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(pedido.estado || 'pendiente')}`}>
          {pedido.estado || 'Pendiente'}
        </span>
      </div>

      <div className="space-y-3 mb-4 border-y border-gray-200 py-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Cliente:</span>
          <span className="font-medium text-gray-900">{pedido.cliente}</span>
        </div>
        <div className="flex justify-between text-lg">
          <span className="text-gray-600 font-semibold">Total:</span>
          <span className="font-bold text-blue-600">{formatCurrency(pedido.total || 0)}</span>
        </div>
      </div>

      {pedido.descripcion && (
        <p className="text-sm text-gray-600 mb-4">{pedido.descripcion}</p>
      )}

      <div className="flex gap-3">
        <Link
          to={`/pedidos/${pedido.id}/editar`}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 text-center"
        >
          Editar
        </Link>
        <button
          onClick={() => onDelete(pedido.id)}
          className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
};
