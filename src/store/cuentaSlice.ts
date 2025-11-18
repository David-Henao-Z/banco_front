import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Cuenta, CuentaCreate, CuentasQueryParams, TipoCuentaModel } from '@/interfaces';
import { CuentaService, TipoCuentaService } from '@/services';

interface CuentaState {
  cuentas: Cuenta[];
  cuentaSeleccionada: Cuenta | null;
  tiposCuenta: TipoCuentaModel[];
  isLoading: boolean;
  error: string | null;
}

const initialState: CuentaState = {
  cuentas: [],
  cuentaSeleccionada: null,
  tiposCuenta: [],
  isLoading: false,
  error: null,
};

// Async thunks - Cuentas
export const listarCuentas = createAsyncThunk(
  'cuentas/listar',
  async (params: CuentasQueryParams | undefined, { rejectWithValue }) => {
    try {
      return await CuentaService.listar(params);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Error al obtener cuentas');
    }
  }
);

export const obtenerCuenta = createAsyncThunk(
  'cuentas/obtener',
  async (id: string, { rejectWithValue }) => {
    try {
      return await CuentaService.obtener(id);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Error al obtener cuenta');
    }
  }
);

export const crearCuenta = createAsyncThunk(
  'cuentas/crear',
  async (cuenta: CuentaCreate, { rejectWithValue }) => {
    try {
      return await CuentaService.crear(cuenta);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Error al crear cuenta');
    }
  }
);

export const actualizarCuenta = createAsyncThunk(
  'cuentas/actualizar',
  async ({ id, cuenta }: { id: string; cuenta: CuentaCreate }, { rejectWithValue }) => {
    try {
      return await CuentaService.actualizar(id, cuenta);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Error al actualizar cuenta');
    }
  }
);

export const eliminarCuenta = createAsyncThunk(
  'cuentas/eliminar',
  async (id: string, { rejectWithValue }) => {
    try {
      await CuentaService.eliminar(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Error al eliminar cuenta');
    }
  }
);

export const obtenerCuentasPorCliente = createAsyncThunk(
  'cuentas/obtenerPorCliente',
  async (clienteId: string, { rejectWithValue }) => {
    try {
      return await CuentaService.obtenerPorCliente(clienteId);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Error al obtener cuentas del cliente');
    }
  }
);

// Async thunks - Tipos de Cuenta
export const listarTiposCuenta = createAsyncThunk(
  'cuentas/listarTipos',
  async (_, { rejectWithValue }) => {
    try {
      return await TipoCuentaService.listar();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Error al obtener tipos de cuenta');
    }
  }
);

const cuentaSlice = createSlice({
  name: 'cuentas',
  initialState,
  reducers: {
    clearCuentaError: (state) => {
      state.error = null;
    },
    setCuentaSeleccionada: (state, action: PayloadAction<Cuenta | null>) => {
      state.cuentaSeleccionada = action.payload;
    },
    clearCuentaSeleccionada: (state) => {
      state.cuentaSeleccionada = null;
    },
    actualizarSaldoCuenta: (state, action: PayloadAction<{ cuentaId: string; nuevoSaldo: number }>) => {
      const { cuentaId, nuevoSaldo } = action.payload;
      const cuenta = state.cuentas.find(c => c.id === cuentaId);
      if (cuenta) {
        cuenta.saldo = nuevoSaldo;
      }
      if (state.cuentaSeleccionada?.id === cuentaId) {
        state.cuentaSeleccionada.saldo = nuevoSaldo;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Listar cuentas
      .addCase(listarCuentas.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(listarCuentas.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cuentas = action.payload;
        state.error = null;
      })
      .addCase(listarCuentas.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Obtener cuenta
      .addCase(obtenerCuenta.fulfilled, (state, action) => {
        state.cuentaSeleccionada = action.payload;
      })
      
      // Crear cuenta
      .addCase(crearCuenta.fulfilled, (state, action) => {
        state.cuentas.push(action.payload);
      })
      
      // Actualizar cuenta
      .addCase(actualizarCuenta.fulfilled, (state, action) => {
        const index = state.cuentas.findIndex(c => c.id === action.payload.id);
        if (index !== -1) {
          state.cuentas[index] = action.payload;
        }
        if (state.cuentaSeleccionada?.id === action.payload.id) {
          state.cuentaSeleccionada = action.payload;
        }
      })
      
      // Eliminar cuenta
      .addCase(eliminarCuenta.fulfilled, (state, action) => {
        state.cuentas = state.cuentas.filter(c => c.id !== action.payload);
        if (state.cuentaSeleccionada?.id === action.payload) {
          state.cuentaSeleccionada = null;
        }
      })
      
      // Obtener cuentas por cliente
      .addCase(obtenerCuentasPorCliente.fulfilled, (state, action) => {
        state.cuentas = action.payload;
      })
      
      // Listar tipos de cuenta
      .addCase(listarTiposCuenta.fulfilled, (state, action) => {
        state.tiposCuenta = action.payload;
      });
  },
});

export const { 
  clearCuentaError, 
  setCuentaSeleccionada, 
  clearCuentaSeleccionada,
  actualizarSaldoCuenta 
} = cuentaSlice.actions;
export default cuentaSlice.reducer;