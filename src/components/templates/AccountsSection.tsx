import React, { useState } from 'react';
import { Button, Input, Card } from '@/components/atoms';

interface Account {
  id: string;
  accountNumber: string;
  clientName: string;
  accountType: string;
  balance: string;
  status: 'active' | 'inactive' | 'frozen';
  openDate: string;
  lastTransaction: string;
}

const AccountsSection: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const accounts: Account[] = [
    {
      id: '1',
      accountNumber: '1001-2345-6789',
      clientName: 'Juan Pérez García',
      accountType: 'Cuenta Corriente',
      balance: '$15,420.00',
      status: 'active',
      openDate: '2023-01-15',
      lastTransaction: '2024-11-08'
    },
    {
      id: '2',
      accountNumber: '1001-2345-6790',
      clientName: 'María González López',
      accountType: 'Cuenta de Ahorros',
      balance: '$8,750.00',
      status: 'active',
      openDate: '2023-03-22',
      lastTransaction: '2024-11-09'
    },
    {
      id: '3',
      accountNumber: '1001-2345-6791',
      clientName: 'Carlos Rodríguez',
      accountType: 'Cuenta Premium',
      balance: '$32,100.00',
      status: 'active',
      openDate: '2022-11-08',
      lastTransaction: '2024-11-09'
    },
    {
      id: '4',
      accountNumber: '1001-2345-6792',
      clientName: 'Ana Martínez Silva',
      accountType: 'Cuenta Básica',
      balance: '$5,200.00',
      status: 'frozen',
      openDate: '2023-05-10',
      lastTransaction: '2024-10-25'
    }
  ];

  const filteredAccounts = accounts.filter(account => {
    const matchesSearch = account.accountNumber.includes(searchTerm) ||
                         account.clientName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || account.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'frozen': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Activa';
      case 'inactive': return 'Inactiva';
      case 'frozen': return 'Congelada';
      default: return status;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestión de Cuentas</h2>
          <p className="text-gray-600">Administra las cuentas bancarias</p>
        </div>
        <Button>
          Nueva Cuenta
        </Button>
      </div>

      <Card>
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Buscar por número de cuenta o cliente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">Todos los estados</option>
            <option value="active">Activas</option>
            <option value="inactive">Inactivas</option>
            <option value="frozen">Congeladas</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {accounts.filter(a => a.status === 'active').length}
            </div>
            <div className="text-sm text-blue-600">Cuentas Activas</div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">
              {accounts.filter(a => a.status === 'frozen').length}
            </div>
            <div className="text-sm text-yellow-600">Cuentas Congeladas</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              ${accounts.reduce((sum, acc) => sum + parseFloat(acc.balance.replace(/[$,]/g, '')), 0).toLocaleString()}
            </div>
            <div className="text-sm text-green-600">Balance Total</div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Número de Cuenta
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo de Cuenta
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Balance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Última Transacción
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAccounts.map((account) => (
                <tr key={account.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{account.accountNumber}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{account.clientName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{account.accountType}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{account.balance}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(account.status)}`}>
                      {getStatusText(account.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(account.lastTransaction).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                    <Button variant="outline" size="sm">
                      Ver
                    </Button>
                    <Button variant="outline" size="sm">
                      Editar
                    </Button>
                    {account.status === 'frozen' && (
                      <Button variant="outline" size="sm" className="text-green-600">
                        Descongelar
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredAccounts.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No se encontraron cuentas que coincidan con los criterios de búsqueda.</p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default AccountsSection;