import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  // Auth
  loginUser,
  logoutUser,
  
  // Clientes
  listarClientes,
  crearCliente,
  obtenerCliente,
  
  // Cuentas
  listarCuentas,
  crearCuenta,
  listarTiposCuenta,
  
  // Transacciones
  realizarDeposito,
  realizarRetiro,
  realizarTransferencia,
  listarTransacciones
} from '@/store';

const TestPanel: React.FC = () => {
  const dispatch = useAppDispatch();
  
  // Estados de Redux
  const { user, isAuthenticated, isLoading: authLoading } = useAppSelector(state => state.auth);
  const { clientes, isLoading: clientesLoading } = useAppSelector(state => state.clientes);
  const { cuentas, tiposCuenta, isLoading: cuentasLoading } = useAppSelector(state => state.cuentas);
  const { transacciones, isLoading: transaccionesLoading } = useAppSelector(state => state.transacciones);
  
  // Estados locales para formularios
  const [clienteForm, setClienteForm] = useState({ nombre_completo: '', documento: '' });
  const [cuentaForm, setCuentaForm] = useState({ id_cliente: '', id_tipo_cuenta: '' });
  const [transaccionForm, setTransaccionForm] = useState({ 
    id_cuenta: '', 
    monto: 0,
    id_cuenta_destino: '' 
  });

  // Auto-cargar datos cuando se autentica
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(listarClientes());
      dispatch(listarCuentas(undefined));
      dispatch(listarTiposCuenta());
      dispatch(listarTransacciones(undefined));
    }
  }, [isAuthenticated, dispatch]);

  // Funciones de prueba
  const handleLogin = () => {
    dispatch(loginUser({ username: 'admin@banco.com', password: 'admin123' }));
  };

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  const handleCrearCliente = () => {
    if (clienteForm.nombre_completo && clienteForm.documento) {
      dispatch(crearCliente(clienteForm));
      setClienteForm({ nombre_completo: '', documento: '' });
    }
  };

  const handleCrearCuenta = () => {
    if (cuentaForm.id_cliente && cuentaForm.id_tipo_cuenta) {
      dispatch(crearCuenta(cuentaForm));
      setCuentaForm({ id_cliente: '', id_tipo_cuenta: '' });
    }
  };

  const handleDeposito = () => {
    if (transaccionForm.id_cuenta && transaccionForm.monto > 0) {
      dispatch(realizarDeposito({ 
        id_cuenta: transaccionForm.id_cuenta, 
        monto: transaccionForm.monto 
      }));
    }
  };

  const handleRetiro = () => {
    if (transaccionForm.id_cuenta && transaccionForm.monto > 0) {
      dispatch(realizarRetiro({ 
        id_cuenta: transaccionForm.id_cuenta, 
        monto: transaccionForm.monto 
      }));
    }
  };

  const handleTransferencia = () => {
    if (transaccionForm.id_cuenta && transaccionForm.id_cuenta_destino && transaccionForm.monto > 0) {
      dispatch(realizarTransferencia({
        id_cuenta_origen: transaccionForm.id_cuenta,
        id_cuenta_destino: transaccionForm.id_cuenta_destino,
        monto: transaccionForm.monto
      }));
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">🧪 Panel de Pruebas - API Banco</h1>
      
      {/* Sección de Autenticación */}
      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <h2 className="text-xl font-semibold mb-3">🔐 Autenticación</h2>
        <div className="flex gap-3 items-center">
          {!isAuthenticated ? (
            <button 
              onClick={handleLogin}
              disabled={authLoading}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {authLoading ? 'Iniciando...' : 'Login (admin@banco.com)'}
            </button>
          ) : (
            <>
              <span className="text-green-600 font-medium">✅ Conectado como: {user?.username}</span>
              <button 
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Cerrar Sesión
              </button>
            </>
          )}
        </div>
      </div>

      {isAuthenticated && (
        <>
          {/* Sección de Clientes */}
          <div className="bg-green-50 p-4 rounded-lg mb-6">
            <h2 className="text-xl font-semibold mb-3">👥 Clientes ({clientes.length})</h2>
            
            {/* Crear Cliente */}
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                placeholder="Nombre completo"
                value={clienteForm.nombre_completo}
                onChange={(e) => setClienteForm(prev => ({...prev, nombre_completo: e.target.value}))}
                className="border px-3 py-2 rounded"
              />
              <input
                type="text"
                placeholder="Documento"
                value={clienteForm.documento}
                onChange={(e) => setClienteForm(prev => ({...prev, documento: e.target.value}))}
                className="border px-3 py-2 rounded"
              />
              <button 
                onClick={handleCrearCliente}
                disabled={clientesLoading}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Crear Cliente
              </button>
            </div>

            {/* Lista de Clientes */}
            <div className="max-h-32 overflow-y-auto">
              {clientes.map(cliente => (
                <div key={cliente.id} className="flex justify-between items-center border-b py-1">
                  <span>{cliente.nombre_completo} - {cliente.documento}</span>
                  <span className="text-sm text-gray-500">{cliente.id}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Sección de Cuentas */}
          <div className="bg-yellow-50 p-4 rounded-lg mb-6">
            <h2 className="text-xl font-semibold mb-3">🏦 Cuentas ({cuentas.length})</h2>
            
            {/* Crear Cuenta */}
            <div className="flex gap-2 mb-4">
              <select
                value={cuentaForm.id_cliente}
                onChange={(e) => setCuentaForm(prev => ({...prev, id_cliente: e.target.value}))}
                className="border px-3 py-2 rounded"
              >
                <option value="">Seleccionar Cliente</option>
                {clientes.map(cliente => (
                  <option key={cliente.id} value={cliente.id}>
                    {cliente.nombre_completo}
                  </option>
                ))}
              </select>
              <select
                value={cuentaForm.id_tipo_cuenta}
                onChange={(e) => setCuentaForm(prev => ({...prev, id_tipo_cuenta: e.target.value}))}
                className="border px-3 py-2 rounded"
              >
                <option value="">Tipo de Cuenta</option>
                {tiposCuenta.map(tipo => (
                  <option key={tipo.id} value={tipo.id}>
                    {tipo.nombre}
                  </option>
                ))}
              </select>
              <button 
                onClick={handleCrearCuenta}
                disabled={cuentasLoading}
                className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
              >
                Crear Cuenta
              </button>
            </div>

            {/* Lista de Cuentas */}
            <div className="max-h-32 overflow-y-auto">
              {cuentas.map(cuenta => (
                <div key={cuenta.id} className="flex justify-between items-center border-b py-1">
                  <span>{cuenta.numero} - Saldo: ${cuenta.saldo.toLocaleString()}</span>
                  <span className="text-sm text-gray-500">{cuenta.id}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Sección de Transacciones */}
          <div className="bg-purple-50 p-4 rounded-lg mb-6">
            <h2 className="text-xl font-semibold mb-3">💰 Transacciones ({transacciones.length})</h2>
            
            {/* Formulario de Transacciones */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <select
                  value={transaccionForm.id_cuenta}
                  onChange={(e) => setTransaccionForm(prev => ({...prev, id_cuenta: e.target.value}))}
                  className="border px-3 py-2 rounded w-full"
                >
                  <option value="">Cuenta Origen</option>
                  {cuentas.map(cuenta => (
                    <option key={cuenta.id} value={cuenta.id}>
                      {cuenta.numero} (${cuenta.saldo.toLocaleString()})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <input
                  type="number"
                  placeholder="Monto"
                  value={transaccionForm.monto}
                  onChange={(e) => setTransaccionForm(prev => ({...prev, monto: Number(e.target.value)}))}
                  className="border px-3 py-2 rounded w-full"
                />
              </div>
              <div>
                <select
                  value={transaccionForm.id_cuenta_destino}
                  onChange={(e) => setTransaccionForm(prev => ({...prev, id_cuenta_destino: e.target.value}))}
                  className="border px-3 py-2 rounded w-full"
                >
                  <option value="">Cuenta Destino (para transferencia)</option>
                  {cuentas.map(cuenta => (
                    <option key={cuenta.id} value={cuenta.id}>
                      {cuenta.numero} (${cuenta.saldo.toLocaleString()})
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={handleDeposito}
                  disabled={transaccionesLoading}
                  className="bg-green-500 text-white px-3 py-2 rounded hover:bg-green-600 flex-1"
                >
                  Depósito
                </button>
                <button 
                  onClick={handleRetiro}
                  disabled={transaccionesLoading}
                  className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 flex-1"
                >
                  Retiro
                </button>
                <button 
                  onClick={handleTransferencia}
                  disabled={transaccionesLoading}
                  className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 flex-1"
                >
                  Transferir
                </button>
              </div>
            </div>

            {/* Lista de Transacciones */}
            <div className="max-h-40 overflow-y-auto">
              {transacciones.map(transaccion => (
                <div key={transaccion.id} className="flex justify-between items-center border-b py-1">
                  <span>
                    <strong>{transaccion.tipo}</strong> - ${transaccion.monto.toLocaleString()}
                  </span>
                  <span className="text-sm text-gray-500">
                    {new Date(transaccion.momento).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Footer con instrucciones */}
      <div className="bg-gray-100 p-4 rounded-lg">
        <h3 className="font-semibold mb-2">🎯 Instrucciones:</h3>
        <ol className="list-decimal list-inside space-y-1 text-sm">
          <li>Haz clic en "Login" para autenticarte</li>
          <li>Crea algunos clientes con nombre y documento</li>
          <li>Crea cuentas para los clientes</li>
          <li>Realiza depósitos para agregar saldo</li>
          <li>Prueba retiros y transferencias</li>
          <li>Abre Redux DevTools (F12) para ver el estado en tiempo real</li>
        </ol>
      </div>
    </div>
  );
};

export default TestPanel;