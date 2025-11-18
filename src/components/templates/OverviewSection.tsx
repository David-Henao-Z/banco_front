import React, { useEffect, useState } from 'react';
import { Card } from '@/components/atoms';

interface Cliente {
  id: string;
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

type TipoTransaccionBack = 'DEPOSITO' | 'RETIRO' | 'TRANSFERENCIA';

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

type ActivityKind =
  | 'TRANSACCION'
  | 'CLIENTE_NUEVO'
  | 'CLIENTE_EDITADO'
  | 'CUENTA_NUEVA'
  | 'CUENTA_EDITADA';

interface ActivityItem {
  id: string;
  fecha: string; // ISO date
  tipo: ActivityKind;
  titulo: string;
  descripcion: string;
  monto?: number;
}

const typeLabels: Record<TipoTransaccionBack, string> = {
  DEPOSITO: 'Depósito',
  RETIRO: 'Retiro',
  TRANSFERENCIA: 'Transferencia',
};

const OverviewSection: React.FC = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [cuentas, setCuentas] = useState<Cuenta[]>([]);
  const [transacciones, setTransacciones] = useState<TransaccionEnriquecida[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');

        const headers: HeadersInit = {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        };

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
          throw new Error('Error al cargar datos del resumen');
        }

        const clientesData: Cliente[] = await resClientes.json();
        const cuentasData: Cuenta[] = await resCuentas.json();
        const txData: Transaccion[] = await resTx.json();

        // Mapas de apoyo para enriquecer transacciones
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

            const cliOrigen = origen ? mapaClientes.get(origen.id_cliente) : undefined;
            const cliDestino = destino ? mapaClientes.get(destino.id_cliente) : undefined;

            return {
              ...tx,
              cuentaOrigenNumero: origen?.numero,
              cuentaDestinoNumero: destino?.numero,
              clienteOrigenNombre: cliOrigen?.nombre_completo,
              clienteDestinoNombre: cliDestino?.nombre_completo,
            };
          })
          .sort(
            (a, b) =>
              new Date(b.momento).getTime() - new Date(a.momento).getTime()
          );

        setClientes(clientesData);
        setCuentas(cuentasData);
        setTransacciones(txEnriquecidas);
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Error al cargar resumen');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // --------- Cálculos de métricas ---------
  const hoyStr = new Date().toISOString().slice(0, 10); // yyyy-mm-dd

  const totalClientes = clientes.length;
  const totalCuentas = cuentas.length;
  const balanceTotal = cuentas.reduce((sum, c) => sum + (c.saldo || 0), 0);

  const nuevosClientesHoy = clientes.filter(
    (c) => c.fecha_creacion?.slice(0, 10) === hoyStr
  ).length;

  const nuevasCuentasHoy = cuentas.filter(
    (c) => c.fecha_creacion?.slice(0, 10) === hoyStr
  ).length;

  const transaccionesHoy = transacciones.filter(
    (tx) => tx.momento.slice(0, 10) === hoyStr
  );
  const totalTxHoy = transaccionesHoy.length;
  const montoTxHoy = transaccionesHoy.reduce((sum, tx) => sum + tx.monto, 0);

  // ------- Actividad global (transacciones + cambios en otras tablas) -------
  const clientesMap = new Map<string, Cliente>(
    clientes.map((c) => [c.id, c])
  );

  const buildActivityTextFromTx = (tx: TransaccionEnriquecida) => {
    const label = typeLabels[tx.tipo];
    switch (tx.tipo) {
      case 'DEPOSITO':
        return tx.cuentaDestinoNumero
          ? `${label} a la cuenta ${tx.cuentaDestinoNumero}`
          : label;
      case 'RETIRO':
        return tx.cuentaOrigenNumero
          ? `${label} desde la cuenta ${tx.cuentaOrigenNumero}`
          : label;
      case 'TRANSFERENCIA':
        if (tx.cuentaOrigenNumero && tx.cuentaDestinoNumero) {
          return `${label} de ${tx.cuentaOrigenNumero} a ${tx.cuentaDestinoNumero}`;
        }
        return label;
      default:
        return label;
    }
  };

  const buildClienteRelacionado = (tx: TransaccionEnriquecida) => {
    if (tx.tipo === 'DEPOSITO') {
      return tx.clienteDestinoNombre || '';
    }
    if (tx.tipo === 'RETIRO') {
      return tx.clienteOrigenNombre || '';
    }
    // TRANSFERENCIA
    return tx.clienteOrigenNombre || tx.clienteDestinoNombre || '';
  };

  const actividades: ActivityItem[] = [];

  // Transacciones
  transacciones.forEach((tx) => {
    actividades.push({
      id: `tx-${tx.id}`,
      fecha: tx.momento,
      tipo: 'TRANSACCION',
      titulo: buildActivityTextFromTx(tx),
      descripcion:
        buildClienteRelacionado(tx) || 'Transacción registrada en el sistema',
      monto: tx.monto,
    });
  });

  // Nuevos clientes y actualizaciones
  clientes.forEach((c) => {
    if (c.fecha_creacion) {
      actividades.push({
        id: `cliente-new-${c.id}`,
        fecha: c.fecha_creacion,
        tipo: 'CLIENTE_NUEVO',
        titulo: 'Nuevo cliente registrado',
        descripcion: `${c.nombre_completo} (${c.documento})`,
      });
    }
    if (c.fecha_edicion) {
      actividades.push({
        id: `cliente-edit-${c.id}`,
        fecha: c.fecha_edicion,
        tipo: 'CLIENTE_EDITADO',
        titulo: 'Cliente actualizado',
        descripcion: `${c.nombre_completo} (${c.documento})`,
      });
    }
  });

  // Nuevas cuentas y actualizaciones
  cuentas.forEach((cta) => {
    const cliente = clientesMap.get(cta.id_cliente);
    const nombreCliente = cliente ? cliente.nombre_completo : 'Cliente desconocido';

    if (cta.fecha_creacion) {
      actividades.push({
        id: `cuenta-new-${cta.id}`,
        fecha: cta.fecha_creacion,
        tipo: 'CUENTA_NUEVA',
        titulo: 'Nueva cuenta creada',
        descripcion: `${cta.numero} - ${nombreCliente}`,
      });
    }
    if (cta.fecha_edicion) {
      actividades.push({
        id: `cuenta-edit-${cta.id}`,
        fecha: cta.fecha_edicion,
        tipo: 'CUENTA_EDITADA',
        titulo: 'Cuenta actualizada',
        descripcion: `${cta.numero} - ${nombreCliente}`,
      });
    }
  });

  const actividadReciente: ActivityItem[] = actividades
    .sort(
      (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
    )
    .slice(0, 8); // últimas 8 actividades mix

  // --------- Alertas básicas ---------
  const muchasTxHoy = totalTxHoy >= 10;
  const sinTxRecientes = transacciones.length === 0;

  const formatCurrency = (value: number) =>
    '$' +
    value.toLocaleString('es-CO', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const formatHora = (iso: string) =>
    new Date(iso).toLocaleString('es-CO', {
      hour: '2-digit',
      minute: '2-digit',
    });

  const formatFechaCorta = (iso: string) =>
    new Date(iso).toLocaleDateString('es-CO', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
    });

  const badgeForActivity = (tipo: ActivityKind) => {
    switch (tipo) {
      case 'TRANSACCION':
        return 'bg-blue-100 text-blue-700';
      case 'CLIENTE_NUEVO':
        return 'bg-emerald-100 text-emerald-700';
      case 'CLIENTE_EDITADO':
        return 'bg-amber-100 text-amber-700';
      case 'CUENTA_NUEVA':
        return 'bg-purple-100 text-purple-700';
      case 'CUENTA_EDITADA':
        return 'bg-pink-100 text-pink-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const labelForActivity = (tipo: ActivityKind) => {
    switch (tipo) {
      case 'TRANSACCION':
        return 'Transacción';
      case 'CLIENTE_NUEVO':
        return 'Nuevo cliente';
      case 'CLIENTE_EDITADO':
        return 'Cliente actualizado';
      case 'CUENTA_NUEVA':
        return 'Nueva cuenta';
      case 'CUENTA_EDITADA':
        return 'Cuenta actualizada';
      default:
        return tipo;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Resumen General</h2>
        <p className="text-gray-600">Cargando datos del banco...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Resumen General</h2>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Título */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Resumen General</h2>
        <p className="text-gray-600">
          Vista general del estado del banco basada en los datos reales del sistema
        </p>
      </div>

      {/* Cards principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="text-sm text-gray-500">Total Clientes</div>
          <div className="mt-2 flex items-end justify-between">
            <div>
              <div className="text-3xl font-bold text-gray-900">
                {totalClientes}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Clientes activos
              </div>
              <div className="text-xs text-emerald-600 mt-1">
                +{nuevosClientesHoy} nuevos hoy
              </div>
            </div>
            <div className="text-3xl">👥</div>
          </div>
        </Card>

        <Card>
          <div className="text-sm text-gray-500">Cuentas Activas</div>
          <div className="mt-2 flex items-end justify-between">
            <div>
              <div className="text-3xl font-bold text-gray-900">
                {totalCuentas}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Cuentas en uso
              </div>
              <div className="text-xs text-emerald-600 mt-1">
                +{nuevasCuentasHoy} creadas hoy
              </div>
            </div>
            <div className="text-3xl">💳</div>
          </div>
        </Card>

        <Card>
          <div className="text-sm text-gray-500">Transacciones Hoy</div>
          <div className="mt-2 flex items-end justify-between">
            <div>
              <div className="text-3xl font-bold text-gray-900">
                {totalTxHoy}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Operaciones realizadas hoy
              </div>
              <div className="text-xs text-blue-600 mt-1">
                Monto movido: {formatCurrency(montoTxHoy)}
              </div>
            </div>
            <div className="text-3xl">💰</div>
          </div>
        </Card>

        <Card>
          <div className="text-sm text-gray-500">Balance Total</div>
          <div className="mt-2 flex items-end justify-between">
            <div>
              <div className="text-3xl font-bold text-gray-900">
                {formatCurrency(balanceTotal)}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Fondos administrados
              </div>
            </div>
            <div className="text-3xl">💼</div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Actividad reciente: transacciones + cambios en otras tablas */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Actividad Reciente
          </h3>
          {actividadReciente.length === 0 ? (
            <p className="text-gray-500 text-sm">
              No hay actividad registrada todavía.
            </p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {actividadReciente.map((act) => (
                <li key={act.id} className="py-3 flex justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-semibold ${badgeForActivity(
                          act.tipo
                        )}`}
                      >
                        {labelForActivity(act.tipo)}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatFechaCorta(act.fecha)} · {formatHora(act.fecha)}
                      </span>
                    </div>
                    <div className="mt-1 text-sm font-medium text-gray-900">
                      {act.titulo}
                    </div>
                    <div className="text-xs text-gray-600">
                      {act.descripcion}
                    </div>
                  </div>
                  <div className="text-right whitespace-nowrap">
                    {act.monto !== undefined && (
                      <div className="text-sm font-semibold text-gray-900">
                        {formatCurrency(act.monto)}
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>

        {/* Alertas del sistema (front-only pero coherentes) */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Alertas del Sistema
          </h3>
          <ul className="space-y-3 text-sm">
            {muchasTxHoy && (
              <li className="flex items-start gap-2">
                <span className="mt-1 w-2 h-2 rounded-full bg-yellow-400" />
                <div>
                  <div className="font-semibold text-gray-900">
                    Alta actividad de transacciones
                  </div>
                  <div className="text-gray-600">
                    Hoy se han registrado {totalTxHoy} operaciones por un monto de{' '}
                    {formatCurrency(montoTxHoy)}. Revisa las
                    transacciones recientes si no esperabas este volumen.
                  </div>
                </div>
              </li>
            )}

            {nuevosClientesHoy > 0 && (
              <li className="flex items-start gap-2">
                <span className="mt-1 w-2 h-2 rounded-full bg-emerald-400" />
                <div>
                  <div className="font-semibold text-gray-900">
                    Nuevos clientes registrados
                  </div>
                  <div className="text-gray-600">
                    Hoy se han creado {nuevosClientesHoy} cliente(s) nuevo(s).
                    Verifica que sus cuentas estén configuradas correctamente.
                  </div>
                </div>
              </li>
            )}

            {nuevasCuentasHoy > 0 && (
              <li className="flex items-start gap-2">
                <span className="mt-1 w-2 h-2 rounded-full bg-purple-400" />
                <div>
                  <div className="font-semibold text-gray-900">
                    Nuevas cuentas creadas
                  </div>
                  <div className="text-gray-600">
                    Hoy se han creado {nuevasCuentasHoy} cuenta(s) nueva(s) para
                    distintos clientes.
                  </div>
                </div>
              </li>
            )}

            {sinTxRecientes && (
              <li className="flex items-start gap-2">
                <span className="mt-1 w-2 h-2 rounded-full bg-blue-400" />
                <div>
                  <div className="font-semibold text-gray-900">
                    Sin movimientos registrados
                  </div>
                  <div className="text-gray-600">
                    Aún no se han registrado transacciones en el sistema. Crea
                    cuentas y realiza operaciones para empezar a ver actividad.
                  </div>
                </div>
              </li>
            )}

            {!muchasTxHoy && !sinTxRecientes && (
              <li className="flex items-start gap-2">
                <span className="mt-1 w-2 h-2 rounded-full bg-green-400" />
                <div>
                  <div className="font-semibold text-gray-900">
                    Operación normal
                  </div>
                  <div className="text-gray-600">
                    El sistema está funcionando correctamente y la actividad de
                    hoy está dentro de los rangos esperados.
                  </div>
                </div>
              </li>
            )}

            <li className="flex items-start gap-2">
              <span className="mt-1 w-2 h-2 rounded-full bg-gray-400" />
              <div>
                <div className="font-semibold text-gray-900">
                  Recuerda realizar backups
                </div>
                <div className="text-gray-600">
                  Programa copias de seguridad regulares de la base de datos
                  del banco para evitar pérdida de información.
                </div>
              </div>
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
};

export default OverviewSection;
