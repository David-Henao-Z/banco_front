import React, { useState } from 'react';
import { Button, Input, Card } from '@/components/atoms';

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  accountCount: number;
  totalBalance: string;
  status: 'active' | 'inactive';
  joinDate: string;
}

const ClientsSection: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const clients: Client[] = [
    {
      id: '1',
      name: 'Juan Pérez García',
      email: 'juan.perez@email.com',
      phone: '+52 555 0123',
      accountCount: 2,
      totalBalance: '$15,420.00',
      status: 'active',
      joinDate: '2023-01-15'
    },
    {
      id: '2',
      name: 'María González López',
      email: 'maria.gonzalez@email.com',
      phone: '+52 555 0456',
      accountCount: 1,
      totalBalance: '$8,750.00',
      status: 'active',
      joinDate: '2023-03-22'
    },
    {
      id: '3',
      name: 'Carlos Rodríguez',
      email: 'carlos.rodriguez@email.com',
      phone: '+52 555 0789',
      accountCount: 3,
      totalBalance: '$32,100.00',
      status: 'active',
      joinDate: '2022-11-08'
    },
    {
      id: '4',
      name: 'Ana Martínez Silva',
      email: 'ana.martinez@email.com',
      phone: '+52 555 0321',
      accountCount: 1,
      totalBalance: '$5,200.00',
      status: 'inactive',
      joinDate: '2023-05-10'
    }
  ];

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestión de Clientes</h2>
          <p className="text-gray-600">Administra los clientes del banco</p>
        </div>
        <Button onClick={() => setShowAddForm(true)}>
          Agregar Cliente
        </Button>
      </div>

      <Card>
        <div className="mb-6">
          <Input
            type="text"
            placeholder="Buscar clientes por nombre o email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contacto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cuentas
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Balance Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredClients.map((client) => (
                <tr key={client.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{client.name}</div>
                      <div className="text-sm text-gray-500">ID: {client.id}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm text-gray-900">{client.email}</div>
                      <div className="text-sm text-gray-500">{client.phone}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {client.accountCount} cuenta{client.accountCount > 1 ? 's' : ''}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {client.totalBalance}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      client.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {client.status === 'active' ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                    <Button variant="outline" size="sm">
                      Ver
                    </Button>
                    <Button variant="outline" size="sm">
                      Editar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredClients.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No se encontraron clientes que coincidan con la búsqueda.</p>
          </div>
        )}
      </Card>

      {showAddForm && (
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Agregar Nuevo Cliente</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Nombre Completo" placeholder="Ingresa el nombre completo" />
              <Input label="Email" type="email" placeholder="correo@ejemplo.com" />
              <Input label="Teléfono" placeholder="+52 555 0000" />
              <Input label="Fecha de Nacimiento" type="date" />
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Cancelar
              </Button>
              <Button>
                Guardar Cliente
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ClientsSection;