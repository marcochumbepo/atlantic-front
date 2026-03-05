// src/features/pedidos/pages/PedidosListPage.jsx

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../../shared/components/Navbar';
import { ConfirmDialog } from '../../shared/components/ConfirmDialog';
import { Alert } from '../../shared/components/Alert';
import { PedidoCard } from '../components/PedidoCard';
import { usePedidos } from '../hooks/usePedidos';

export const PedidosListPage = () => {
  const { pedidos, loading, error, fetchPedidos, deletePedido } = usePedidos();
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchPedidos();
  }, [fetchPedidos]);

  const handleDeleteClick = (id) => {
    setDeleteConfirm(id);
  };

  const handleConfirmDelete = async () => {
    try {
      await deletePedido(deleteConfirm);
      setSuccessMessage('Pedido eliminado correctamente');
      setDeleteConfirm(null);
    } catch (err) {
      console.error('Error al eliminar:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Pedidos</h1>
            <p className="text-gray-600 mt-2">Gestiona todos tus pedidos en un lugar</p>
          </div>
          <Link
            to="/pedidos/nuevo"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition duration-200"
          >
            + Nuevo Pedido
          </Link>
        </div>

        {/* Alerts */}
        {successMessage && (
          <Alert
            message={successMessage}
            type="success"
            onClose={() => setSuccessMessage('')}
          />
        )}

        {error && (
          <Alert
            message={error}
            type="error"
            onClose={() => {}}
            autoClose={false}
          />
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        )}

        {/* Empty State */}
        {!loading && pedidos.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📦</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay pedidos</h3>
            <p className="text-gray-600 mb-6">Comienza creando tu primer pedido</p>
            <Link
              to="/pedidos/nuevo"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition duration-200"
            >
              Crear Primer Pedido
            </Link>
          </div>
        )}

        {/* Pedidos Grid */}
        {!loading && pedidos.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pedidos.map((pedido) => (
              <PedidoCard
                key={pedido.id}
                pedido={pedido}
                onDelete={handleDeleteClick}
              />
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirm !== null}
        title="Eliminar Pedido"
        message="¿Está seguro que desea eliminar este pedido? Esta acción no se puede deshacer."
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteConfirm(null)}
        confirmText="Eliminar"
        cancelText="Cancelar"
        isDangerous={true}
      />
    </div>
  );
};
