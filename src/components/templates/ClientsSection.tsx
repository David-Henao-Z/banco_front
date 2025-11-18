import React, { useEffect, useState } from 'react';
import { Button, Input, Card } from '@/components/atoms';

interface Cliente {
  id: string;               // UUID
  nombre_completo: string;
  documento: string;
  fecha_creacion: string;
  fecha_edicion?: string | null;
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

interface CuentaEnriquecida extends Cuenta {
  tipo_nombre: string;
}

interface ClienteEnriquecido extends Cliente {
  cuentas: CuentaEnriquecida[];
  totalSaldo: number;
  tiposCuenta: string[];
}

type ModalMode = 'create' | 'edit';

const ClientsSection: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [clientes, setClientes] = useState<ClienteEnriquecido[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedClientId, setExpandedClientId] = useState<string | null>(null);

  // --- estado para crear/editar ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>('create');
  const [selectedClient, setSelectedClient] = useState<ClienteEnriquecido | null>(null);
  const [formNombre, setFormNombre] = useState('');
  const [formDocumento, setFormDocumento] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --------- carga de datos ---------
  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const token = localStorage.getItem('token');

      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      const [resClientes, resCuentas, resTipos] = await Promise.all([
        fetch('http://localhost:8000/clientes', { headers }),
        fetch('http://localhost:8000/cuentas', { headers }),
        fetch('http://localhost:8000/tipos-cuenta', { headers }),
      ]);

      if (!resClientes.ok || !resCuentas.ok || !resTipos.ok) {
        if (
          resClientes.status === 401 ||
          resCuentas.status === 401 ||
          resTipos.status === 401
        ) {
          throw new Error('No autorizado. Inicia sesión de nuevo.');
        }
        throw new Error('Error al cargar datos de clientes');
      }

      const clientesData: Cliente[] = await resClientes.json();
      const cuentasData: Cuenta[] = await resCuentas.json();
      const tiposData: TipoCuenta[] = await resTipos.json();

      const mapaTipos: Record<string, string> = {};
      tiposData.forEach((t) => {
        mapaTipos[t.id] = t.nombre;
      });

      const clientesEnriquecidos: ClienteEnriquecido[] = clientesData.map((cli) => {
        const cuentasCliente: CuentaEnriquecida[] = cuentasData
          .filter((c) => c.id_cliente === cli.id)
          .map((c) => ({
            ...c,
            tipo_nombre: mapaTipos[c.id_tipo_cuenta] || 'SIN TIPO',
          }));

        const totalSaldo = cuentasCliente.reduce(
          (sum, c) => sum + (c.saldo || 0),
          0
        );

        const tipos = Array.from(
          new Set(cuentasCliente.map((c) => c.tipo_nombre))
        );

        return {
          ...cli,
          cuentas: cuentasCliente,
          totalSaldo,
          tiposCuenta: tipos.length > 0 ? tipos : ['Sin cuentas'],
        };
      });

      setClientes(clientesEnriquecidos);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error al cargar clientes');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // --------- helpers UI ---------
  const filteredClients = clientes.filter((cliente) => {
    const term = searchTerm.toLowerCase();
    return (
      cliente.nombre_completo.toLowerCase().includes(term) ||
      cliente.documento.toLowerCase().includes(term)
    );
  });

  const toggleExpanded = (id: string) => {
    setExpandedClientId((current) => (current === id ? null : id));
  };

  const openCreateModal = () => {
    setModalMode('create');
    setSelectedClient(null);
    setFormNombre('');
    setFormDocumento('');
    setFormError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (cliente: ClienteEnriquecido) => {
    setModalMode('edit');
    setSelectedClient(cliente);
    setFormNombre(cliente.nombre_completo);
    setFormDocumento(cliente.documento);
    setFormError(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedClient(null);
    setFormNombre('');
    setFormDocumento('');
    setFormError(null);
  };

  // --------- crear / editar cliente ---------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formNombre.trim() || !formDocumento.trim()) {
      setFormError('Nombre y documento son obligatorios');
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
        nombre_completo: formNombre.trim(),
        documento: formDocumento.trim(),
      };

      let response: Response;

      if (modalMode === 'create') {
        response = await fetch('http://localhost:8000/clientes', {
          method: 'POST',
          headers,
          body: JSON.stringify(payload),
        });
      } else {
        if (!selectedClient) {
          setFormError('No se encontró el cliente a editar');
          return;
        }
        response = await fetch(
          `http://localhost:8000/clientes/${selectedClient.id}`,
          {
            method: 'PUT',
            headers,
            body: JSON.stringify(payload),
          }
        );
      }

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        const msg =
          data?.detail ||
          (modalMode === 'create'
            ? 'Error al crear el cliente'
            : 'Error al actualizar el cliente');
        throw new Error(msg);
      }

      // recargamos lista
      await loadData();
      closeModal();
    } catch (err: any) {
      console.error(err);
      setFormError(err.message || 'Error al guardar el cliente');
    } finally {
      setIsSubmitting(false);
    }
  };

  // --------- eliminar cliente ---------
  const handleDelete = async (cliente: ClienteEnriquecido) => {
    const confirmado = window.confirm(
      `¿Seguro que deseas eliminar al cliente "${cliente.nombre_completo}"?\n\nSolo se pueden eliminar clientes sin cuentas asociadas.`
    );
    if (!confirmado) return;

    try {
      const token = localStorage.getItem('token');
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      const response = await fetch(
        `http://localhost:8000/clientes/${cliente.id}`,
        {
          method: 'DELETE',
          headers,
        }
      );

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        const msg = data?.detail || 'Error al eliminar el cliente';
        throw new Error(msg);
      }

      // recargar lista
      await loadData();
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Error al eliminar el cliente');
    }
  };

  // --------- render ---------
  if (isLoading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Gestión de Clientes</h2>
        <p className="text-gray-600">Cargando clientes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Gestión de Clientes</h2>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestión de Clientes</h2>
          <p className="text-gray-600">Administra los clientes y sus cuentas</p>
        </div>
        <Button onClick={openCreateModal}>
          Agregar Cliente
        </Button>
      </div>

      <Card>
        {/* Buscador */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Buscar clientes por nombre o documento..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Tabla principal */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Documento
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nº de Cuentas
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipos de Cuenta
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredClients.map((cliente) => (
                <React.Fragment key={cliente.id}>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {cliente.nombre_completo}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {cliente.documento}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {cliente.cuentas.length}{' '}
                      {cliente.cuentas.length === 1 ? 'cuenta' : 'cuentas'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {cliente.tiposCuenta.join(', ')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleExpanded(cliente.id)}
                      >
                        {expandedClientId === cliente.id ? 'Ocultar' : 'Ver'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditModal(cliente)}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600"
                        onClick={() => handleDelete(cliente)}
                      >
                        Eliminar
                      </Button>
                    </td>
                  </tr>

                  {expandedClientId === cliente.id && (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-4 bg-gray-50 text-sm text-gray-700"
                      >
                        <div className="space-y-3">
                          <div>
                            <span className="font-semibold">ID: </span>
                            <span className="font-mono text-xs break-all">
                              {cliente.id}
                            </span>
                          </div>

                          <div>
                            <span className="font-semibold">Balance total: </span>
                            <span className="font-semibold">
                              $
                              {cliente.totalSaldo.toLocaleString('es-CO', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </span>
                          </div>

                          <div>
                            <span className="font-semibold">Cuentas:</span>
                            {cliente.cuentas.length === 0 ? (
                              <p className="text-gray-500 mt-1">
                                Este cliente no tiene cuentas asociadas.
                              </p>
                            ) : (
                              <div className="mt-2 overflow-x-auto">
                                <table className="min-w-full text-xs">
                                  <thead>
                                    <tr className="text-gray-500">
                                      <th className="pr-4 py-1 text-left">
                                        Número
                                      </th>
                                      <th className="pr-4 py-1 text-left">
                                        Tipo
                                      </th>
                                      <th className="pr-4 py-1 text-left">
                                        Saldo
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {cliente.cuentas.map((cta) => (
                                      <tr key={cta.id}>
                                        <td className="pr-4 py-1">
                                          {cta.numero}
                                        </td>
                                        <td className="pr-4 py-1">
                                          {cta.tipo_nombre}
                                        </td>
                                        <td className="pr-4 py-1">
                                          $
                                          {cta.saldo.toLocaleString('es-CO', {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                          })}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {filteredClients.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">
              No se encontraron clientes que coincidan con la búsqueda.
            </p>
          </div>
        )}
      </Card>

      {/* Modal crear/editar cliente */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {modalMode === 'create' ? 'Agregar Cliente' : 'Editar Cliente'}
            </h3>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre completo
                </label>
                <Input
                  type="text"
                  value={formNombre}
                  onChange={(e) => setFormNombre(e.target.value)}
                  placeholder="Nombre y apellidos"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Documento
                </label>
                <Input
                  type="text"
                  value={formDocumento}
                  onChange={(e) => setFormDocumento(e.target.value)}
                  placeholder="Número de documento"
                />
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
                  {isSubmitting
                    ? 'Guardando...'
                    : modalMode === 'create'
                      ? 'Crear'
                      : 'Guardar cambios'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientsSection;
