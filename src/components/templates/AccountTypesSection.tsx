import React, { useState } from 'react';
import { Button, Input, Card } from '@/components/atoms';

interface AccountType {
  id: string;
  name: string;
  description: string;
  minimumBalance: string;
  monthlyFee: string;
  interestRate: string;
  features: string[];
  isActive: boolean;
  accountCount: number;
}

const AccountTypesSection: React.FC = () => {
  const [showAddForm, setShowAddForm] = useState(false);

  const accountTypes: AccountType[] = [
    {
      id: '1',
      name: 'Cuenta Básica',
      description: 'Cuenta para uso diario con servicios esenciales',
      minimumBalance: '$500.00',
      monthlyFee: '$0.00',
      interestRate: '0.5%',
      features: ['Tarjeta de débito', 'Banca en línea', 'Transferencias básicas'],
      isActive: true,
      accountCount: 1250
    },
    {
      id: '2',
      name: 'Cuenta de Ahorros',
      description: 'Cuenta diseñada para el crecimiento de tus ahorros',
      minimumBalance: '$1,000.00',
      monthlyFee: '$5.00',
      interestRate: '2.5%',
      features: ['Mayor tasa de interés', 'Banca móvil', 'Alertas SMS', 'Retiros limitados'],
      isActive: true,
      accountCount: 892
    },
    {
      id: '3',
      name: 'Cuenta Corriente',
      description: 'Cuenta para transacciones comerciales y empresariales',
      minimumBalance: '$2,500.00',
      monthlyFee: '$15.00',
      interestRate: '1.0%',
      features: ['Cheques ilimitados', 'Transferencias internacionales', 'Gerente de cuenta', 'Sobregiro autorizado'],
      isActive: true,
      accountCount: 567
    },
    {
      id: '4',
      name: 'Cuenta Premium',
      description: 'Cuenta exclusiva con beneficios VIP',
      minimumBalance: '$10,000.00',
      monthlyFee: '$25.00',
      interestRate: '3.0%',
      features: ['Asesor financiero personal', 'Tarjeta de crédito premium', 'Seguros incluidos', 'Beneficios de viaje', 'Acceso a salas VIP'],
      isActive: true,
      accountCount: 234
    },
    {
      id: '5',
      name: 'Cuenta Estudiante',
      description: 'Cuenta especial para estudiantes universitarios',
      minimumBalance: '$100.00',
      monthlyFee: '$0.00',
      interestRate: '1.5%',
      features: ['Sin comisiones', 'Descuentos estudiantiles', 'Banca móvil', 'Límite de retiro diario'],
      isActive: false,
      accountCount: 0
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Tipos de Cuenta</h2>
          <p className="text-gray-600">Gestiona los diferentes tipos de cuenta disponibles</p>
        </div>
        <Button onClick={() => setShowAddForm(true)}>
          Nuevo Tipo de Cuenta
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">
            {accountTypes.filter(type => type.isActive).length}
          </div>
          <div className="text-sm text-blue-600">Tipos Activos</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-green-600">
            {accountTypes.reduce((sum, type) => sum + type.accountCount, 0)}
          </div>
          <div className="text-sm text-green-600">Total de Cuentas</div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">
            {(accountTypes.reduce((sum, type) => sum + parseFloat(type.interestRate), 0) / accountTypes.length).toFixed(1)}%
          </div>
          <div className="text-sm text-purple-600">Tasa Promedio</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {accountTypes.map((type) => (
          <Card key={type.id}>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{type.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{type.description}</p>
                </div>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  type.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {type.isActive ? 'Activo' : 'Inactivo'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-500">Balance Mínimo</p>
                  <p className="font-medium text-gray-900">{type.minimumBalance}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Comisión Mensual</p>
                  <p className="font-medium text-gray-900">{type.monthlyFee}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Tasa de Interés</p>
                  <p className="font-medium text-gray-900">{type.interestRate}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Cuentas Activas</p>
                  <p className="font-medium text-gray-900">{type.accountCount}</p>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-xs text-gray-500 mb-2">Características</p>
                <div className="flex flex-wrap gap-1">
                  {type.features.map((feature, index) => (
                    <span
                      key={index}
                      className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-md"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="flex-1">
                  Editar
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className={`flex-1 ${
                    type.isActive 
                      ? 'text-red-600 hover:bg-red-50' 
                      : 'text-green-600 hover:bg-green-50'
                  }`}
                >
                  {type.isActive ? 'Desactivar' : 'Activar'}
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {showAddForm && (
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Agregar Nuevo Tipo de Cuenta</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Nombre del Tipo" placeholder="Ej: Cuenta Platinum" />
              <Input label="Balance Mínimo" placeholder="$0.00" />
              <Input label="Comisión Mensual" placeholder="$0.00" />
              <Input label="Tasa de Interés %" placeholder="0.0" />
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  rows={3}
                  placeholder="Describe las características de este tipo de cuenta..."
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Características (separadas por coma)
                </label>
                <Input placeholder="Característica 1, Característica 2, Característica 3" />
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Cancelar
              </Button>
              <Button>
                Crear Tipo de Cuenta
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default AccountTypesSection;