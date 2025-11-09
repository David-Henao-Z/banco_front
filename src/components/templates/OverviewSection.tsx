import React from 'react';
import { StatsCard } from '@/components/molecules';

const OverviewSection: React.FC = () => {
  const stats = [
    {
      title: 'Total Clientes',
      value: '2,543',
      icon: '👥',
      trend: { value: '12%', isPositive: true },
      description: 'Clientes activos'
    },
    {
      title: 'Cuentas Activas',
      value: '3,721',
      icon: '💳',
      trend: { value: '8%', isPositive: true },
      description: 'Cuentas en uso'
    },
    {
      title: 'Transacciones Hoy',
      value: '847',
      icon: '💰',
      trend: { value: '23%', isPositive: true },
      description: 'Operaciones realizadas'
    },
    {
      title: 'Balance Total',
      value: '$2.4M',
      icon: '💼',
      trend: { value: '5%', isPositive: true },
      description: 'Fondos administrados'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Resumen General</h2>
        <p className="text-gray-600">Vista general del estado del banco</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Actividad Reciente
          </h3>
          <div className="space-y-3">
            {[
              { action: 'Nueva cuenta creada', user: 'Juan Pérez', time: '2 min' },
              { action: 'Transferencia realizada', user: 'María García', time: '5 min' },
              { action: 'Depósito procesado', user: 'Carlos López', time: '10 min' },
              { action: 'Préstamo aprobado', user: 'Ana Martínez', time: '15 min' },
            ].map((activity, index) => (
              <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                <div>
                  <p className="font-medium text-gray-900">{activity.action}</p>
                  <p className="text-sm text-gray-500">{activity.user}</p>
                </div>
                <span className="text-sm text-gray-400">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Alertas del Sistema
          </h3>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2"></div>
              <div>
                <p className="font-medium text-gray-900">Mantenimiento Programado</p>
                <p className="text-sm text-gray-500">Sistema offline por 2 horas el domingo</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
              <div>
                <p className="font-medium text-gray-900">Backup Completado</p>
                <p className="text-sm text-gray-500">Respaldo de datos exitoso</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
              <div>
                <p className="font-medium text-gray-900">Nueva Actualización</p>
                <p className="text-sm text-gray-500">Versión 2.1.0 disponible</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewSection;