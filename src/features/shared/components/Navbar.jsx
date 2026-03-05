// src/features/shared/components/Navbar.jsx

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/hooks/useAuth';

export const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-gray-900 border-b border-gray-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/pedidos" className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-blue-500">Atlantic</span>
            </Link>
          </div>

          {/* Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/pedidos"
              className="text-gray-300 hover:text-white transition duration-200"
            >
              Pedidos
            </Link>
            <Link
              to="/pedidos/nuevo"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-200"
            >
              Nuevo Pedido
            </Link>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <div className="text-gray-300 text-sm">
              <p className="font-medium">{user?.email || 'Usuario'}</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition duration-200 text-sm"
            >
              Salir
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
