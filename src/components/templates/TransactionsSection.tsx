import React, { useState } from 'react';
import { Button, Input, Card } from '@/components/atoms';

interface Transaction {
  id: string;
  transactionId: string;
  accountNumber: string;
  clientName: string;
  type: 'deposit' | 'withdrawal' | 'transfer' | 'payment';
  amount: string;
  description: string;
  status: 'completed' | 'pending' | 'failed';
  date: string;
  time: string;
}

const TransactionsSection: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [dateRange, setDateRange] = useState('today');

  const transactions: Transaction[] = [
    {
      id: '1',
      transactionId: 'TXN-001-2024-1109-001',
      accountNumber: '1001-2345-6789',
      clientName: 'Juan Pérez García',
      type: 'deposit',
      amount: '+$1,500.00',
      description: 'Depósito en efectivo',
      status: 'completed',
      date: '2024-11-09',
      time: '14:30'
    },
    {
      id: '2',
      transactionId: 'TXN-001-2024-1109-002',
      accountNumber: '1001-2345-6790',
      clientName: 'María González López',
      type: 'transfer',
      amount: '-$850.00',
      description: 'Transferencia a cuenta externa',
      status: 'completed',
      date: '2024-11-09',
      time: '13:45'
    },
    {
      id: '3',
      transactionId: 'TXN-001-2024-1109-003',
      accountNumber: '1001-2345-6791',
      clientName: 'Carlos Rodríguez',
      type: 'withdrawal',
      amount: '-$2,000.00',
      description: 'Retiro en cajero automático',
      status: 'completed',
      date: '2024-11-09',
      time: '12:15'
    },
    {
      id: '4',
      transactionId: 'TXN-001-2024-1109-004',
      accountNumber: '1001-2345-6792',
      clientName: 'Ana Martínez Silva',
      type: 'payment',
      amount: '-$320.50',
      description: 'Pago de servicios públicos',
      status: 'pending',
      date: '2024-11-09',
      time: '11:00'
    },
    {
      id: '5',
      transactionId: 'TXN-001-2024-1108-001',
      accountNumber: '1001-2345-6789',
      clientName: 'Juan Pérez García',
      type: 'transfer',
      amount: '-$500.00',
      description: 'Transferencia fallida - fondos insuficientes',
      status: 'failed',
      date: '2024-11-08',
      time: '16:22'
    }
  ];

  const getTypeText = (type: string) => {
    switch (type) {
      case 'deposit': return 'Depósito';
      case 'withdrawal': return 'Retiro';
      case 'transfer': return 'Transferencia';
      case 'payment': return 'Pago';
      default: return type;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'deposit': return 'bg-green-100 text-green-800';
      case 'withdrawal': return 'bg-red-100 text-red-800';
      case 'transfer': return 'bg-blue-100 text-blue-800';
      case 'payment': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Completada';
      case 'pending': return 'Pendiente';
      case 'failed': return 'Fallida';
      default: return status;
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.accountNumber.includes(searchTerm);
    const matchesType = filterType === 'all' || transaction.type === filterType;
    const matchesStatus = filterStatus === 'all' || transaction.status === filterStatus;
    
    // Filtro de fecha simplificado
    let matchesDate = true;
    if (dateRange === 'today') {
      matchesDate = transaction.date === '2024-11-09';
    } else if (dateRange === 'week') {
      // Para simplicidad, mostramos todas las transacciones de esta semana
      matchesDate = true;
    }
    
    return matchesSearch && matchesType && matchesStatus && matchesDate;
  });

  const totalAmount = filteredTransactions.reduce((sum, transaction) => {
    const amount = parseFloat(transaction.amount.replace(/[+\-$,]/g, ''));
    return sum + (transaction.amount.startsWith('-') ? -amount : amount);
  }, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Transacciones</h2>
          <p className="text-gray-600">Historial y gestión de transacciones</p>
        </div>
        <Button>
          Exportar Reporte
        </Button>
      </div>

      <Card>
        <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input
            type="text"
            placeholder="Buscar transacciones..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">Todos los tipos</option>
            <option value="deposit">Depósitos</option>
            <option value="withdrawal">Retiros</option>
            <option value="transfer">Transferencias</option>
            <option value="payment">Pagos</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">Todos los estados</option>
            <option value="completed">Completadas</option>
            <option value="pending">Pendientes</option>
            <option value="failed">Fallidas</option>
          </select>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="today">Hoy</option>
            <option value="week">Esta semana</option>
            <option value="month">Este mes</option>
            <option value="all">Todo el tiempo</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {filteredTransactions.length}
            </div>
            <div className="text-sm text-blue-600">Transacciones</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {filteredTransactions.filter(t => t.status === 'completed').length}
            </div>
            <div className="text-sm text-green-600">Completadas</div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">
              {filteredTransactions.filter(t => t.status === 'pending').length}
            </div>
            <div className="text-sm text-yellow-600">Pendientes</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className={`text-2xl font-bold ${totalAmount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${Math.abs(totalAmount).toLocaleString()}
            </div>
            <div className="text-sm text-purple-600">Monto Total</div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID Transacción
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente / Cuenta
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Monto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Descripción
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha/Hora
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{transaction.transactionId}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{transaction.clientName}</div>
                      <div className="text-sm text-gray-500">{transaction.accountNumber}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(transaction.type)}`}>
                      {getTypeText(transaction.type)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm font-medium ${
                      transaction.amount.startsWith('-') ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {transaction.amount}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate">{transaction.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(transaction.status)}`}>
                      {getStatusText(transaction.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm text-gray-900">{new Date(transaction.date).toLocaleDateString()}</div>
                      <div className="text-sm text-gray-500">{transaction.time}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                    <Button variant="outline" size="sm">
                      Ver
                    </Button>
                    {transaction.status === 'pending' && (
                      <Button variant="outline" size="sm" className="text-green-600">
                        Aprobar
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredTransactions.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No se encontraron transacciones que coincidan con los criterios de búsqueda.</p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default TransactionsSection;