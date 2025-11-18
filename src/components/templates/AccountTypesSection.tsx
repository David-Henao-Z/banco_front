import React, { useEffect, useState } from 'react';
import { Card, Button, Input } from '@/components/atoms';

interface TipoCuenta {
  id: string;
  nombre: string;
  descripcion?: string | null;
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

interface TipoCuentaEnriquecido extends TipoCuenta {
  numeroCuentas: number;
  saldoTotal: number;
  saldoPromedio: number;
}

const AccountTypesSection: React.FC = () => {
  const [types, setTypes] = useState<TipoCuentaEnriquecido[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // métricas globales
  const [totalCuentas, setTotalCuentas] = useState(0);
  const [saldoTotalCuentas, setSaldoTotalCuentas] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const token = localStorage.getItem('token');
        const headers: HeadersInit = {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        };

        const [resTipos, resCuentas] = await Promise.all([
          fetch('http://localhost:8000/tipos-cuenta', { headers }),
          fetch('http://localhost:8000/cuentas', { headers }),
        ]);

        if (!resTipos.ok || !resCuentas.ok) {
          if (resTipos.status === 401 || resCuentas.status === 401) {
            throw new Error('No autorizado. Inicia sesión de nuevo.');
          }
          throw new Error('Error al cargar tipos de cuenta');
        }

        const tiposData: TipoCuenta[] = await resTipos.json();
        const cuentasData: Cuenta[] = await resCuentas.json();

        setTotalCuentas(cuentasData.length);
        const saldoTotal = cuentasData.reduce(
          (sum, c) => sum + (c.saldo || 0),
          0
        );
        setSaldoTotalCuentas(saldoTotal);

        // enriquecer cada tipo con datos de cuentas
        const tiposEnriquecidos: TipoCuentaEnriquecido[] = tiposData.map((tipo) => {
          const cuentasDelTipo = cuentasData.filter(
            (c) => c.id_tipo_cuenta === tipo.id
          );

          const nCuentas = cuentasDelTipo.length;
          const saldoTotalTipo = cuentasDelTipo.reduce(
            (sum, c) => sum + (c.saldo || 0),
            0
          );

          return {
            ...tipo,
            numeroCuentas: nCuentas,
            saldoTotal: saldoTotalTipo,
            saldoPromedio: nCuentas > 0 ? saldoTotalTipo / nCuentas : 0,
          };
        });

        setTypes(tiposEnriquecidos);
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Error al cargar tipos de cuenta');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatCurrency = (value: number) =>
    '$' +
    value.toLocaleString('es-CO', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const filteredTypes = types.filter((t) =>
    t.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleNewTypeClick = () => {
    alert(
      'La creación/edición de tipos de cuenta requiere endpoints en la API (POST/PUT/DELETE /tipos-cuenta).\n\nPor ahora esta sección es solo de consulta de los tipos creados en la base de datos.'
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Tipos de Cuenta</h2>
        <p className="text-gray-600">Cargando tipos de cuenta...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Tipos de Cuenta</h2>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Tipos de Cuenta</h2>
          <p className="text-gray-600">
            Gestiona los diferentes tipos de cuenta disponibles (vista de solo lectura)
          </p>
        </div>
        <Button onClick={handleNewTypeClick}>
          Nuevo Tipo de Cuenta
        </Button>
      </div>

      {/* Métricas generales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <div className="text-sm text-gray-500">Tipos activos</div>
          <div className="mt-2 text-3xl font-bold text-gray-900">
            {types.length}
          </div>
        </Card>
        <Card>
          <div className="text-sm text-gray-500">Total de cuentas</div>
          <div className="mt-2 text-3xl font-bold text-gray-900">
            {totalCuentas}
          </div>
        </Card>
        <Card>
          <div className="text-sm text-gray-500">Saldo total en todas las cuentas</div>
          <div className="mt-2 text-2xl font-bold text-gray-900">
            {formatCurrency(saldoTotalCuentas)}
          </div>
        </Card>
      </div>

      {/* Buscador */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="flex-1 w-full">
            <Input
              type="text"
              placeholder="Buscar tipo de cuenta por nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="text-xs text-gray-500">
            Mostrando {filteredTypes.length} de {types.length} tipos
          </div>
        </div>
      </Card>

      {/* Grid de tipos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredTypes.map((tipo) => (
          <Card key={tipo.id}>
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {tipo.nombre}
                </h3>
                {tipo.descripcion && (
                  <p className="text-sm text-gray-600 mt-1">
                    {tipo.descripcion}
                  </p>
                )}
              </div>
              <span className="inline-flex items-center px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                Activo
              </span>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
              <div>
                <div className="text-xs text-gray-500 uppercase">
                  Cuentas
                </div>
                <div className="mt-1 text-base font-semibold text-gray-900">
                  {tipo.numeroCuentas}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500 uppercase">
                  Saldo total
                </div>
                <div className="mt-1 text-base font-semibold text-gray-900">
                  {formatCurrency(tipo.saldoTotal)}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500 uppercase">
                  Saldo promedio
                </div>
                <div className="mt-1 text-base font-semibold text-gray-900">
                  {formatCurrency(tipo.saldoPromedio)}
                </div>
              </div>
            </div>

            <div className="mt-4 text-xs text-gray-400 break-all">
              ID: {tipo.id}
            </div>
          </Card>
        ))}
      </div>

      {filteredTypes.length === 0 && (
        <Card>
          <p className="text-center text-gray-500 py-6">
            No se encontraron tipos de cuenta que coincidan con la búsqueda.
          </p>
        </Card>
      )}
    </div>
  );
};

export default AccountTypesSection;
