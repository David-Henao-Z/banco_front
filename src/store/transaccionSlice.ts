import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { 
  Transaccion, 
  Deposito, 
  Retiro, 
  Transferencia, 
  TransaccionesQueryParams 
} from '@/interfaces';
import { TransaccionService } from '@/services';

interface TransaccionState {
  transacciones: Transaccion[];
  transaccionSeleccionada: Transaccion | null;
  historial: Transaccion[];
  isLoading: boolean;
  error: string | null;
}

const initialState: TransaccionState = {
  transacciones: [],
  transaccionSeleccionada: null,
  historial: [],
  isLoading: false,
  error: null,
};

// Async thunks
export const listarTransacciones = createAsyncThunk(
  'transacciones/listar',
  async (params: TransaccionesQueryParams | undefined, { rejectWithValue }) => {
    try {
      return await TransaccionService.listar(params);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Error al obtener transacciones');
    }
  }
);

export const obtenerTransaccion = createAsyncThunk(
  'transacciones/obtener',
  async (id: string, { rejectWithValue }) => {
    try {
      return await TransaccionService.obtener(id);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Error al obtener transacción');
    }
  }
);

export const realizarDeposito = createAsyncThunk(
  'transacciones/deposito',
  async (deposito: Deposito, { rejectWithValue }) => {
    try {
      return await TransaccionService.depositar(deposito);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Error al realizar depósito');
    }
  }
);

export const realizarRetiro = createAsyncThunk(
  'transacciones/retiro',
  async (retiro: Retiro, { rejectWithValue }) => {
    try {
      return await TransaccionService.retirar(retiro);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Error al realizar retiro');
    }
  }
);

export const realizarTransferencia = createAsyncThunk(
  'transacciones/transferencia',
  async (transferencia: Transferencia, { rejectWithValue }) => {
    try {
      return await TransaccionService.transferir(transferencia);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Error al realizar transferencia');
    }
  }
);

export const obtenerTransaccionesPorCuenta = createAsyncThunk(
  'transacciones/obtenerPorCuenta',
  async (cuentaId: string, { rejectWithValue }) => {
    try {
      return await TransaccionService.obtenerPorCuenta(cuentaId);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Error al obtener transacciones de la cuenta');
    }
  }
);

export const obtenerHistorialTransacciones = createAsyncThunk(
  'transacciones/obtenerHistorial',
  async (
    params: { limite?: number; offset?: number; filtros?: Omit<TransaccionesQueryParams, 'limite' | 'offset'> },
    { rejectWithValue }
  ) => {
    try {
      const { limite = 20, offset = 0, filtros } = params;
      return await TransaccionService.obtenerHistorial(limite, offset, filtros);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Error al obtener historial');
    }
  }
);

const transaccionSlice = createSlice({
  name: 'transacciones',
  initialState,
  reducers: {
    clearTransaccionError: (state) => {
      state.error = null;
    },
    setTransaccionSeleccionada: (state, action: PayloadAction<Transaccion | null>) => {
      state.transaccionSeleccionada = action.payload;
    },
    clearTransaccionSeleccionada: (state) => {
      state.transaccionSeleccionada = null;
    },
    clearHistorial: (state) => {
      state.historial = [];
    },
    agregarTransaccionAlHistorial: (state, action: PayloadAction<Transaccion>) => {
      state.historial.unshift(action.payload); // Agregar al inicio
      state.transacciones.unshift(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      // Listar transacciones
      .addCase(listarTransacciones.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(listarTransacciones.fulfilled, (state, action) => {
        state.isLoading = false;
        state.transacciones = action.payload;
        state.error = null;
      })
      .addCase(listarTransacciones.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Obtener transacción
      .addCase(obtenerTransaccion.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(obtenerTransaccion.fulfilled, (state, action) => {
        state.isLoading = false;
        state.transaccionSeleccionada = action.payload;
        state.error = null;
      })
      .addCase(obtenerTransaccion.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Realizar depósito
      .addCase(realizarDeposito.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(realizarDeposito.fulfilled, (state, action) => {
        state.isLoading = false;
        state.transacciones.unshift(action.payload);
        state.historial.unshift(action.payload);
        state.error = null;
      })
      .addCase(realizarDeposito.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Realizar retiro
      .addCase(realizarRetiro.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(realizarRetiro.fulfilled, (state, action) => {
        state.isLoading = false;
        state.transacciones.unshift(action.payload);
        state.historial.unshift(action.payload);
        state.error = null;
      })
      .addCase(realizarRetiro.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Realizar transferencia
      .addCase(realizarTransferencia.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(realizarTransferencia.fulfilled, (state, action) => {
        state.isLoading = false;
        state.transacciones.unshift(action.payload);
        state.historial.unshift(action.payload);
        state.error = null;
      })
      .addCase(realizarTransferencia.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Obtener transacciones por cuenta
      .addCase(obtenerTransaccionesPorCuenta.fulfilled, (state, action) => {
        state.transacciones = action.payload;
      })
      
      // Obtener historial
      .addCase(obtenerHistorialTransacciones.fulfilled, (state, action) => {
        state.historial = action.payload;
      });
  },
});

export const { 
  clearTransaccionError, 
  setTransaccionSeleccionada, 
  clearTransaccionSeleccionada,
  clearHistorial,
  agregarTransaccionAlHistorial
} = transaccionSlice.actions;
export default transaccionSlice.reducer;