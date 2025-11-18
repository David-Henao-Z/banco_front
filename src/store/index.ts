export * from './store';
export * from './hooks';

// Auth slice
export { 
  loginUser, 
  logoutUser, 
  clearAuthError, 
  setUser 
} from './authSlice';

// Cliente slice
export {
  listarClientes,
  obtenerCliente,
  crearCliente,
  actualizarCliente,
  eliminarCliente,
  clearClienteError,
  setClienteSeleccionado,
  clearClienteSeleccionado
} from './clienteSlice';

// Cuenta slice
export {
  listarCuentas,
  obtenerCuenta,
  crearCuenta,
  actualizarCuenta,
  eliminarCuenta,
  obtenerCuentasPorCliente,
  listarTiposCuenta,
  clearCuentaError,
  setCuentaSeleccionada,
  clearCuentaSeleccionada,
  actualizarSaldoCuenta
} from './cuentaSlice';

// Transaccion slice
export {
  listarTransacciones,
  obtenerTransaccion,
  realizarDeposito,
  realizarRetiro,
  realizarTransferencia,
  obtenerTransaccionesPorCuenta,
  obtenerHistorialTransacciones,
  clearTransaccionError,
  setTransaccionSeleccionada,
  clearTransaccionSeleccionada,
  clearHistorial,
  agregarTransaccionAlHistorial
} from './transaccionSlice';