import React, { useEffect, useState } from 'react';
import { Button, Input, Card } from '@/components/atoms';

interface Cliente {
  id: string;
  nombre_completo: string;
  documento: string;
}

interface Cuenta {
  id: string;
  numero: string;
  id_cliente: string;
  id_tipo_cuenta: string;
  saldo: number;
  fecha_creacion: string;
  fecha_edicion?: string | null;
}

interface TipoCuenta {
  id: string;
  nombre: string;
  descripcion?: string | null;
}

interface CuentaEnriquecida {
  id: string;
  numero: string;
  saldo: number;
  fecha_creacion: string;
  fecha_edicion?: string | null;
  clienteNombre: string;
  clienteDocumento: string;
  tipoNombre: string;
}

const AccountsSection: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [accounts, setAccounts] = useState<CuentaEnriquecida[]>([]);
  const [clients, setClients] = useState<Cliente[]>([]);
  const [accountTypes, setAccountTypes] = useState<TipoCuenta[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // estado modal nueva cuenta
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [selectedTypeId, setSelectedTypeId] = useState<string>('');
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --------- Carga de datos ---------
  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const token = localStorage.getItem('token');

      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      // Pedimos cuentas, clientes y tipos de cuenta en paralelo
      const [resCuentas, resClientes, resTipos] = await Promise.all([
        fetch('http://localhost:8000/cuentas', { headers }),
        fetch('http://localhost:8000/clientes', { headers }),
        fetch('http://localhost:8000/tipos-cuenta', { headers }),
      ]);

      if (!resCuentas.ok || !resClientes.ok || !resTipos.ok) {
        if (
          resCuentas.status === 401 ||
          resClientes.status === 401 ||
          resTipos.status === 401
        ) {
          throw new Error('No autorizado. Inicia sesión de nuevo.');
        }
        throw new Error('Error al cargar datos de cuentas');
      }

      const cuentasData: Cuenta[] = await resCuentas.json();
      const clientesData: Cliente[] = await resClientes.json();
      const tiposData: TipoCuenta[] = await resTipos.json();

      setClients(clientesData);
      setAccountTypes(tiposData);

      // Mapas de apoyo
      const mapaClientes = new Map<string, Cliente>();
      clientesData.forEach((c) => mapaClientes.set(c.id, c));

      const mapaTipos = new Map<string, string>();
      tiposData.forEach((t) => mapaTipos.set(t.id, t.nombre));

      // Enriquecer cuentas con nombre de cliente, documento y tipo de cuenta
      const cuentasEnriquecidas: CuentaEnriquecida[] = cuentasData.map((cta) => {
        const cliente = mapaClientes.get(cta.id_cliente);
        const tipoNombre = mapaTipos.get(cta.id_tipo_cuenta) || 'SIN TIPO';

        return {
          id: cta.id,
          numero: cta.numero,
          saldo: cta.saldo,
          fecha_creacion: cta.fecha_creacion,
          fecha_edicion: cta.fecha_edicion,
          clienteNombre: cliente?.nombre_completo || 'Cliente desconocido',
          clienteDocumento: cliente?.documento || '—',
          tipoNombre,
        };
      });

      setAccounts(cuentasEnriquecidas);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error al cargar cuentas');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --------- Filtros y métricas ---------
  const filteredAccounts = accounts.filter((account) => {
    const term = searchTerm.toLowerCase();
    return (
      account.numero.toLowerCase().includes(term) ||
      account.clienteNombre.toLowerCase().includes(term) ||
      account.clienteDocumento.toLowerCase().includes(term)
    );
  });

  const totalCuentas = accounts.length;
  const totalSaldo = accounts.reduce((sum, acc) => sum + (acc.saldo || 0), 0);
  const clientesConCuentas = new Set(accounts.map((a) => a.clienteDocumento)).size;

  const formatCurrency = (value: number) =>
    '$' +
    value.toLocaleString('es-CO', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  // --------- Modal Nueva Cuenta ---------
  const openModal = () => {
    setFormError(null);
    if (clients.length > 0 && !selectedClientId) {
      setSelectedClientId(clients[0].id);
    }
    if (accountTypes.length > 0 && !selectedTypeId) {
      setSelectedTypeId(accountTypes[0].id);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormError(null);
    // no limpio selecciones para que recuerde última elección
  };

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!selectedClientId || !selectedTypeId) {
      setFormError('Debes seleccionar un cliente y un tipo de cuenta');
      return;
    }

    try {
      setIsSubmitting(true);

      const token = localStorage.getItem('token');
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      const payload = {
        id_cliente: selectedClientId,
        id_tipo_cuenta: selectedTypeId,
      };

      const response = await fetch('http://localhost:8000/cuentas', {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        const msg = data?.detail || 'Error al crear la cuenta';
        throw new Error(msg);
      }

      await fetchData();
      closeModal();
    } catch (err: any) {
      console.error(err);
      setFormError(err.message || 'Error al crear la cuenta');
    } finally {
      setIsSubmitting(false);
    }
  };

  // --------- Eliminar cuenta ---------
  const handleDeleteAccount = async (account: CuentaEnriquecida) => {
    const confirmado = window.confirm(
      `¿Seguro que deseas eliminar la cuenta ${account.numero}?\n\nSolo se pueden eliminar cuentas con saldo 0.`
    );
    if (!confirmado) return;

    try {
      const token = localStorage.getItem('token');
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      const response = await fetch(
        `http://localhost:8000/cuentas/${account.id}`,
        {
          method: 'DELETE',
          headers,
        }
      );

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        const msg = data?.detail || 'Error al eliminar la cuenta';
        throw new Error(msg);
      }

      await fetchData();
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Error al eliminar la cuenta');
    }
  };

  // --------- Render ---------
  if (isLoading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Gestión de Cuentas</h2>
        <p className="text-gray-600">Cargando cuentas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Gestión de Cuentas</h2>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestión de Cuentas</h2>
          <p className="text-gray-600">Administra las cuentas bancarias del banco</p>
        </div>
        <Button onClick={openModal}>
          Nueva Cuenta
        </Button>
      </div>

      <Card>
        {/* Filtros + métricas */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Buscar por número de cuenta, cliente o documento..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {totalCuentas}
            </div>
            <div className="text-sm text-blue-600">Cuentas totales</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {clientesConCuentas}
            </div>
            <div className="text-sm text-purple-600">Clientes con cuentas</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(totalSaldo)}
            </div>
            <div className="text-sm text-green-600">Saldo total</div>
          </div>
        </div>

        {/* Tabla de cuentas */}
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
                  Saldo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha de creación
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
                    <div className="text-sm font-medium text-gray-900">
                      {account.numero}
                    </div>
                    <div className="text-[11px] text-gray-400 mt-1">
                      ID: {account.id}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {account.clienteNombre}
                    </div>
                    <div className="text-xs text-gray-500">
                      Documento: {account.clienteDocumento}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {account.tipoNombre}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                    {formatCurrency(account.saldo)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(account.fecha_creacion).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                    <Button variant="outline" size="sm">
                      Ver
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600"
                      onClick={() => handleDeleteAccount(account)}
                    >
                      Eliminar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredAccounts.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">
              No se encontraron cuentas que coincidan con la búsqueda.
            </p>
          </div>
        )}
      </Card>

      {/* Modal Nueva Cuenta */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Nueva Cuenta
            </h3>

            {clients.length === 0 || accountTypes.length === 0 ? (
              <p className="text-sm text-gray-600">
                No hay clientes o tipos de cuenta configurados. Crea primero un
                cliente y un tipo de cuenta.
              </p>
            ) : (
              <form className="space-y-4" onSubmit={handleCreateAccount}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cliente
                  </label>
                  <select
                    value={selectedClientId}
                    onChange={(e) => setSelectedClientId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nombre_completo} — {c.documento}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de cuenta
                  </label>
                  <select
                    value={selectedTypeId}
                    onChange={(e) => setSelectedTypeId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    {accountTypes.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                {formError && (
                  <p className="text-sm text-red-600">{formError}</p>
                )}

                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={closeModal}
                    disabled={isSubmitting}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Creando...' : 'Crear Cuenta'}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountsSection;
