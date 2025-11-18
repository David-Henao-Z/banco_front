import React, { useEffect, useState } from 'react';
import { Card, Button, Input } from '@/components/atoms';

type TipoTransaccionBack = 'DEPOSITO' | 'RETIRO' | 'TRANSFERENCIA';

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

interface Transaccion {
  id: string;
  tipo: TipoTransaccionBack;
  id_cuenta_origen?: string | null;
  id_cuenta_destino?: string | null;
  monto: number;
  momento: string;
  fecha_creacion: string;
  fecha_edicion?: string | null;
}

interface TransaccionEnriquecida extends Transaccion {
  cuentaOrigenNumero?: string;
  cuentaDestinoNumero?: string;
  clienteOrigenNombre?: string;
  clienteDestinoNombre?: string;
}

type OperationTab = 'DEPOSITO' | 'RETIRO' | 'TRANSFERENCIA';

const typeLabels: Record<TipoTransaccionBack, string> = {
  DEPOSITO: 'Depósito',
  RETIRO: 'Retiro',
  TRANSFERENCIA: 'Transferencia',
};

const TransactionsSection: React.FC = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [cuentas, setCuentas] = useState<Cuenta[]>([]);
  const [transacciones, setTransacciones] = useState<TransaccionEnriquecida[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // filtros
  const [filtroCuentaId, setFiltroCuentaId] = useState<string>('');
  const [filtroDesde, setFiltroDesde] = useState<string>('');
  const [filtroHasta, setFiltroHasta] = useState<string>('');

  // pestaña de operación
  const [activeTab, setActiveTab] = useState<OperationTab>('DEPOSITO');

  // formularios de operaciones
  const [cuentaIdOper, setCuentaIdOper] = useState<string>(''); // para dep/ret
  const [cuentaOrigenId, setCuentaOrigenId] = useState<string>(''); // transf
  const [cuentaDestinoId, setCuentaDestinoId] = useState<string>(''); // transf
  const [montoOper, setMontoOper] = useState<string>('');
  const [opError, setOpError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatCurrency = (value: number) =>
    '$' +
    value.toLocaleString('es-CO', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  // =========================
  // Carga de datos base + transacciones
  // =========================
  useEffect(() => {
    const fetchBaseData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const token = localStorage.getItem('token');
        const headers: HeadersInit = {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        };

        // clientes, cuentas y transacciones (sin filtros) todo junto
        const [resClientes, resCuentas, resTx] = await Promise.all([
          fetch('http://localhost:8000/clientes', { headers }),
          fetch('http://localhost:8000/cuentas', { headers }),
          fetch('http://localhost:8000/transacciones', { headers }),
        ]);

        if (!resClientes.ok || !resCuentas.ok || !resTx.ok) {
          if (
            resClientes.status === 401 ||
            resCuentas.status === 401 ||
            resTx.status === 401
          ) {
            throw new Error('No autorizado. Inicia sesión de nuevo.');
          }
          throw new Error('Error al cargar datos de transacciones');
        }

        const clientesData: Cliente[] = await resClientes.json();
        const cuentasData: Cuenta[] = await resCuentas.json();
        const txData: Transaccion[] = await resTx.json();

        setClientes(clientesData);
        setCuentas(cuentasData);

        // defaults para selects
        if (cuentasData.length > 0) {
          setCuentaIdOper(cuentasData[0].id);
          setCuentaOrigenId(cuentasData[0].id);
          if (cuentasData.length > 1) {
            setCuentaDestinoId(cuentasData[1].id);
          }
        }

        // enriquecer transacciones con info de cuentas y clientes
        const txEnriquecidas = enriquecerTransacciones(
          txData,
          cuentasData,
          clientesData
        );
        setTransacciones(txEnriquecidas);
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Error al cargar transacciones');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBaseData();
  }, []);

  // función para enriquecer transacciones
  const enriquecerTransacciones = (
    txData: Transaccion[],
    cuentasData: Cuenta[],
    clientesData: Cliente[]
  ): TransaccionEnriquecida[] => {
    const mapaCuentas = new Map<string, Cuenta>();
    cuentasData.forEach((c) => mapaCuentas.set(c.id, c));

    const mapaClientes = new Map<string, Cliente>();
    clientesData.forEach((cl) => mapaClientes.set(cl.id, cl));

    const txEnriquecidas: TransaccionEnriquecida[] = txData
      .map((tx) => {
        const origen = tx.id_cuenta_origen
          ? mapaCuentas.get(tx.id_cuenta_origen)
          : undefined;
        const destino = tx.id_cuenta_destino
          ? mapaCuentas.get(tx.id_cuenta_destino)
          : undefined;

        const cliOrigen = origen
          ? mapaClientes.get(origen.id_cliente)
          : undefined;
        const cliDestino = destino
          ? mapaClientes.get(destino.id_cliente)
          : undefined;

        return {
          ...tx,
          cuentaOrigenNumero: origen?.numero,
          cuentaDestinoNumero: destino?.numero,
          clienteOrigenNombre: cliOrigen?.nombre_completo,
          clienteDestinoNombre: cliDestino?.nombre_completo,
        };
      })
      .sort(
        (a, b) => new Date(b.momento).getTime() - new Date(a.momento).getTime()
      );

    return txEnriquecidas;
  };

  // =========================
  // Cargar transacciones con filtros
  // =========================
  const fetchTransacciones = async (headersOverride?: HeadersInit) => {
    try {
      const token = localStorage.getItem('token');
      const headers: HeadersInit = headersOverride || {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      const params = new URLSearchParams();
      if (filtroCuentaId) params.append('cuenta_id', filtroCuentaId);
      if (filtroDesde) params.append('desde', filtroDesde);
      if (filtroHasta) params.append('hasta', filtroHasta);

      const url =
        'http://localhost:8000/transacciones' +
        (params.toString() ? `?${params.toString()}` : '');

      const resTx = await fetch(url, { headers });

      if (!resTx.ok) {
        if (resTx.status === 401) {
          throw new Error('No autorizado. Inicia sesión de nuevo.');
        }
        throw new Error('Error al cargar transacciones');
      }

      const txData: Transaccion[] = await resTx.json();
      const txEnriquecidas = enriquecerTransacciones(txData, cuentas, clientes);
      setTransacciones(txEnriquecidas);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error al cargar transacciones');
    }
  };

  // =========================
  // Métricas
  // =========================
  const hoyStr = new Date().toISOString().slice(0, 10);

  const transaccionesHoy = transacciones.filter(
    (tx) => tx.momento.slice(0, 10) === hoyStr
  );

  const totalEntrante = transacciones
    .filter((tx) => tx.tipo === 'DEPOSITO' || tx.tipo === 'TRANSFERENCIA')
    .reduce((sum, tx) => sum + tx.monto, 0);

  const totalSaliente = transacciones
    .filter((tx) => tx.tipo === 'RETIRO' || tx.tipo === 'TRANSFERENCIA')
    .reduce((sum, tx) => sum + tx.monto, 0);

  // =========================
  // Helpers
  // =========================
  const buildTxDescription = (tx: TransaccionEnriquecida) => {
    switch (tx.tipo) {
      case 'DEPOSITO':
        return tx.cuentaDestinoNumero
          ? `Depósito a ${tx.cuentaDestinoNumero}`
          : 'Depósito';
      case 'RETIRO':
        return tx.cuentaOrigenNumero
          ? `Retiro de ${tx.cuentaOrigenNumero}`
          : 'Retiro';
      case 'TRANSFERENCIA':
        if (tx.cuentaOrigenNumero && tx.cuentaDestinoNumero) {
          return `Transferencia ${tx.cuentaOrigenNumero} → ${tx.cuentaDestinoNumero}`;
        }
        return 'Transferencia';
      default:
        return tx.tipo;
    }
  };

  // cuenta seleccionada para depósito/retiro (para mostrar saldo)
  const selectedCuentaSimpleOp = cuentas.find((c) => c.id === cuentaIdOper);
  const selectedCuentaOrigen = cuentas.find((c) => c.id === cuentaOrigenId);
  const selectedCuentaDestino = cuentas.find((c) => c.id === cuentaDestinoId);

  // =========================
  // Operaciones (depósito/retiro/transferencia)
  // =========================
  const handleSubmitOperacion = async (e: React.FormEvent) => {
    e.preventDefault();
    setOpError(null);

    const monto = parseFloat(montoOper);
    if (isNaN(monto) || monto <= 0) {
      setOpError('Ingresa un monto válido mayor a 0');
      return;
    }

    // Validaciones de saldo en front
    if (activeTab === 'RETIRO') {
      if (!selectedCuentaSimpleOp) {
        setOpError('Selecciona una cuenta');
        return;
      }
      if (monto > selectedCuentaSimpleOp.saldo) {
        setOpError('Saldo insuficiente para realizar el retiro');
        return;
      }
    }

    if (activeTab === 'TRANSFERENCIA') {
      if (!selectedCuentaOrigen || !selectedCuentaDestino) {
        setOpError('Selecciona cuenta de origen y destino');
        return;
      }
      if (selectedCuentaOrigen.id === selectedCuentaDestino.id) {
        setOpError('La cuenta origen y destino deben ser distintas');
        return;
      }
      if (monto > selectedCuentaOrigen.saldo) {
        setOpError('Saldo insuficiente en la cuenta de origen');
        return;
      }
    }

    try {
      setIsSubmitting(true);

      const token = localStorage.getItem('token');
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      let url = '';
      let body: any = {};

      if (activeTab === 'DEPOSITO') {
        if (!cuentaIdOper) {
          setOpError('Selecciona una cuenta');
          return;
        }
        url = 'http://localhost:8000/transacciones/deposito';
        body = {
          id_cuenta: cuentaIdOper,
          monto,
        };
      } else if (activeTab === 'RETIRO') {
        if (!cuentaIdOper) {
          setOpError('Selecciona una cuenta');
          return;
        }
        url = 'http://localhost:8000/transacciones/retiro';
        body = {
          id_cuenta: cuentaIdOper,
          monto,
        };
      } else {
        // TRANSFERENCIA
        url = 'http://localhost:8000/transacciones/transferencia';
        body = {
          id_cuenta_origen: cuentaOrigenId,
          id_cuenta_destino: cuentaDestinoId,
          monto,
        };
      }

      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        const msg =
          data?.detail ||
          (activeTab === 'DEPOSITO'
            ? 'Error al realizar el depósito'
            : activeTab === 'RETIRO'
              ? 'Error al realizar el retiro'
              : 'Error al realizar la transferencia');
        throw new Error(msg);
      }

      // recargar transacciones
      await fetchTransacciones(headers);
      setMontoOper('');
    } catch (err: any) {
      console.error(err);
      setOpError(err.message || 'Error al procesar la operación');
    } finally {
      setIsSubmitting(false);
    }
  };

  // =========================
  // Eliminar transacción
  // =========================
  const handleDeleteTx = async (tx: TransaccionEnriquecida) => {
    const confirmado = window.confirm(
      `¿Seguro que deseas eliminar esta transacción?\n\n${buildTxDescription(
        tx
      )} por ${formatCurrency(tx.monto)}`
    );
    if (!confirmado) return;

    try {
      const token = localStorage.getItem('token');
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      const response = await fetch(
        `http://localhost:8000/transacciones/${tx.id}`,
        {
          method: 'DELETE',
          headers,
        }
      );

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        const msg = data?.detail || 'Error al eliminar la transacción';
        throw new Error(msg);
      }

      await fetchTransacciones(headers);
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Error al eliminar la transacción');
    }
  };

  // =========================
  // Render
  // =========================
  if (isLoading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Transacciones</h2>
        <p className="text-gray-600">Cargando transacciones...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Transacciones</h2>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Transacciones</h2>
        <p className="text-gray-600">
          Consulta y realiza operaciones sobre las cuentas bancarias
        </p>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="text-sm text-gray-500">Total transacciones</div>
          <div className="mt-2 text-3xl font-bold text-gray-900">
            {transacciones.length}
          </div>
        </Card>
        <Card>
          <div className="text-sm text-gray-500">Transacciones hoy</div>
          <div className="mt-2 text-3xl font-bold text-gray-900">
            {transaccionesHoy.length}
          </div>
        </Card>
        <Card>
          <div className="text-sm text-gray-500">Monto entrante</div>
          <div className="mt-2 text-2xl font-bold text-green-700">
            {formatCurrency(totalEntrante)}
          </div>
        </Card>
        <Card>
          <div className="text-sm text-gray-500">Monto saliente</div>
          <div className="mt-2 text-2xl font-bold text-red-700">
            {formatCurrency(totalSaliente)}
          </div>
        </Card>
      </div>

      {/* Filtros + operaciones */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Filtros */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Filtros
          </h3>
          <div className="space-y-4 text-sm">
            <div>
              <label className="block text-gray-700 mb-1">Cuenta</label>
              <select
                value={filtroCuentaId}
                onChange={(e) => setFiltroCuentaId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Todas</option>
                {cuentas.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.numero}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-2">
              <div className="flex-1">
                <label className="block text-gray-700 mb-1">Desde</label>
                <Input
                  type="date"
                  value={filtroDesde}
                  onChange={(e) => setFiltroDesde(e.target.value)}
                />
              </div>
              <div className="flex-1">
                <label className="block text-gray-700 mb-1">Hasta</label>
                <Input
                  type="date"
                  value={filtroHasta}
                  onChange={(e) => setFiltroHasta(e.target.value)}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                onClick={() => {
                  setFiltroCuentaId('');
                  setFiltroDesde('');
                  setFiltroHasta('');
                  fetchTransacciones();
                }}
              >
                Limpiar
              </Button>
              <Button onClick={() => fetchTransacciones()}>
                Aplicar filtros
              </Button>
            </div>
          </div>
        </Card>

        {/* Operaciones */}
        <Card className="lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Nueva operación
          </h3>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 mb-4 text-sm">
            {(['DEPOSITO', 'RETIRO', 'TRANSFERENCIA'] as OperationTab[]).map(
              (tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => {
                    setActiveTab(tab);
                    setOpError(null);
                  }}
                  className={`px-4 py-2 -mb-px border-b-2 ${activeTab === tab
                    ? 'border-primary-500 text-primary-600 font-semibold'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                >
                  {typeLabels[tab]}
                </button>
              )
            )}
          </div>

          <form className="space-y-4 text-sm" onSubmit={handleSubmitOperacion}>
            {activeTab !== 'TRANSFERENCIA' ? (
              <div>
                <label className="block text-gray-700 mb-1">Cuenta</label>
                <select
                  value={cuentaIdOper}
                  onChange={(e) => setCuentaIdOper(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {cuentas.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.numero}
                    </option>
                  ))}
                </select>
                {/* Saldo actual para depósito/retiro */}
                {selectedCuentaSimpleOp && (
                  <p className="mt-1 text-xs text-gray-500">
                    Saldo actual:{' '}
                    <span className="font-semibold">
                      {formatCurrency(selectedCuentaSimpleOp.saldo)}
                    </span>
                  </p>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-1">
                    Cuenta origen
                  </label>
                  <select
                    value={cuentaOrigenId}
                    onChange={(e) => setCuentaOrigenId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    {cuentas.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.numero}
                      </option>
                    ))}
                  </select>
                  {selectedCuentaOrigen && (
                    <p className="mt-1 text-xs text-gray-500">
                      Saldo origen:{' '}
                      <span className="font-semibold">
                        {formatCurrency(selectedCuentaOrigen.saldo)}
                      </span>
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">
                    Cuenta destino
                  </label>
                  <select
                    value={cuentaDestinoId}
                    onChange={(e) => setCuentaDestinoId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    {cuentas.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.numero}
                      </option>
                    ))}
                  </select>
                  {selectedCuentaDestino && (
                    <p className="mt-1 text-xs text-gray-500">
                      Saldo destino:{' '}
                      <span className="font-semibold">
                        {formatCurrency(selectedCuentaDestino.saldo)}
                      </span>
                    </p>
                  )}
                </div>
              </div>
            )}

            <div>
              <label className="block text-gray-700 mb-1">Monto</label>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={montoOper}
                onChange={(e) => setMontoOper(e.target.value)}
                placeholder="Ej: 100000"
              />
            </div>

            {opError && <p className="text-sm text-red-600">{opError}</p>}

            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? 'Procesando...'
                  : `Confirmar ${typeLabels[activeTab]}`}
              </Button>
            </div>
          </form>
        </Card>
      </div>

      {/* Tabla de transacciones */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Historial de transacciones
        </h3>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Detalle
                </th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Monto
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente relacionado
                </th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {transacciones.map((tx) => (
                <tr key={tx.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 whitespace-nowrap">
                    {new Date(tx.momento).toLocaleString('es-CO', {
                      dateStyle: 'short',
                      timeStyle: 'short',
                    })}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${tx.tipo === 'DEPOSITO'
                        ? 'bg-green-100 text-green-800'
                        : tx.tipo === 'RETIRO'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-blue-100 text-blue-800'
                        }`}
                    >
                      {typeLabels[tx.tipo]}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    <div className="text-gray-900">
                      {buildTxDescription(tx)}
                    </div>
                    <div className="text-[11px] text-gray-400 mt-1 break-all">
                      ID: {tx.id}
                    </div>
                  </td>
                  <td className="px-4 py-2 text-right font-semibold">
                    {formatCurrency(tx.monto)}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <div className="text-gray-900">
                      {/* Cliente relacionado:
                         - Depósito: cliente de la cuenta destino
                         - Retiro: cliente de la cuenta origen
                         - Transferencia: cliente origen (o destino si no hay) */}
                      {tx.tipo === 'DEPOSITO'
                        ? tx.clienteDestinoNombre || '—'
                        : tx.tipo === 'RETIRO'
                          ? tx.clienteOrigenNombre || '—'
                          : tx.clienteOrigenNombre ||
                          tx.clienteDestinoNombre ||
                          '—'}
                    </div>
                  </td>
                  <td className="px-4 py-2 text-right whitespace-nowrap">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600"
                      onClick={() => handleDeleteTx(tx)}
                    >
                      Eliminar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {transacciones.length === 0 && (
          <p className="text-center text-gray-500 py-6">
            No hay transacciones registradas.
          </p>
        )}
      </Card>
    </div>
  );
};

export default TransactionsSection;
