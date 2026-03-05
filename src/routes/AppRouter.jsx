// src/routes/AppRouter.jsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '../features/auth/components/ProtectedRoute';
import { LoginPage } from '../features/auth/pages/LoginPage';
import { PedidosListPage } from '../features/pedidos/pages/PedidosListPage';
import { PedidosFormPage } from '../features/pedidos/pages/PedidosFormPage';

export const AppRouter = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Routes */}
        <Route
          path="/pedidos"
          element={
            <ProtectedRoute>
              <PedidosListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pedidos/nuevo"
          element={
            <ProtectedRoute>
              <PedidosFormPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pedidos/:id/editar"
          element={
            <ProtectedRoute>
              <PedidosFormPage />
            </ProtectedRoute>
          }
        />

        {/* Default Redirect */}
        <Route path="/" element={<Navigate to="/pedidos" replace />} />
        <Route path="*" element={<Navigate to="/pedidos" replace />} />
      </Routes>
    </Router>
  );
};
