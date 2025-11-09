import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/atoms';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logoutUser } from '@/store';

const DashboardHeader: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate('/');
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-primary-600">
              Banco Digital
            </h1>
            <span className="ml-4 text-sm text-gray-500">
              Panel de Administración
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-700">
              Bienvenido, {user?.firstName || user?.username || 'Usuario'}
            </span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;