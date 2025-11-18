import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import clienteReducer from './clienteSlice';
import cuentaReducer from './cuentaSlice';
import transaccionReducer from './transaccionSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    clientes: clienteReducer,
    cuentas: cuentaReducer,
    transacciones: transaccionReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;