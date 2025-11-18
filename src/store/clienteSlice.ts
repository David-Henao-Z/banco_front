import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Cliente, ClienteCreate } from '@/interfaces';
import { ClienteService } from '@/services';

interface ClienteState {
  clientes: Cliente[];
  clienteSeleccionado: Cliente | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: ClienteState = {
  clientes: [],
  clienteSeleccionado: null,
  isLoading: false,
  error: null,
};

// Async thunks
export const listarClientes = createAsyncThunk(
  'clientes/listar',
  async (_, { rejectWithValue }) => {
    try {
      return await ClienteService.listar();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Error al obtener clientes');
    }
  }
);

export const obtenerCliente = createAsyncThunk(
  'clientes/obtener',
  async (id: string, { rejectWithValue }) => {
    try {
      return await ClienteService.obtener(id);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Error al obtener cliente');
    }
  }
);

export const crearCliente = createAsyncThunk(
  'clientes/crear',
  async (cliente: ClienteCreate, { rejectWithValue }) => {
    try {
      return await ClienteService.crear(cliente);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Error al crear cliente');
    }
  }
);

export const actualizarCliente = createAsyncThunk(
  'clientes/actualizar',
  async ({ id, cliente }: { id: string; cliente: ClienteCreate }, { rejectWithValue }) => {
    try {
      return await ClienteService.actualizar(id, cliente);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Error al actualizar cliente');
    }
  }
);

export const eliminarCliente = createAsyncThunk(
  'clientes/eliminar',
  async (id: string, { rejectWithValue }) => {
    try {
      await ClienteService.eliminar(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Error al eliminar cliente');
    }
  }
);

const clienteSlice = createSlice({
  name: 'clientes',
  initialState,
  reducers: {
    clearClienteError: (state) => {
      state.error = null;
    },
    setClienteSeleccionado: (state, action: PayloadAction<Cliente | null>) => {
      state.clienteSeleccionado = action.payload;
    },
    clearClienteSeleccionado: (state) => {
      state.clienteSeleccionado = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Listar clientes
      .addCase(listarClientes.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(listarClientes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.clientes = action.payload;
        state.error = null;
      })
      .addCase(listarClientes.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Obtener cliente
      .addCase(obtenerCliente.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(obtenerCliente.fulfilled, (state, action) => {
        state.isLoading = false;
        state.clienteSeleccionado = action.payload;
        state.error = null;
      })
      .addCase(obtenerCliente.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Crear cliente
      .addCase(crearCliente.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(crearCliente.fulfilled, (state, action) => {
        state.isLoading = false;
        state.clientes.push(action.payload);
        state.error = null;
      })
      .addCase(crearCliente.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Actualizar cliente
      .addCase(actualizarCliente.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(actualizarCliente.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.clientes.findIndex(c => c.id === action.payload.id);
        if (index !== -1) {
          state.clientes[index] = action.payload;
        }
        if (state.clienteSeleccionado?.id === action.payload.id) {
          state.clienteSeleccionado = action.payload;
        }
        state.error = null;
      })
      .addCase(actualizarCliente.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Eliminar cliente
      .addCase(eliminarCliente.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(eliminarCliente.fulfilled, (state, action) => {
        state.isLoading = false;
        state.clientes = state.clientes.filter(c => c.id !== action.payload);
        if (state.clienteSeleccionado?.id === action.payload) {
          state.clienteSeleccionado = null;
        }
        state.error = null;
      })
      .addCase(eliminarCliente.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearClienteError, setClienteSeleccionado, clearClienteSeleccionado } = clienteSlice.actions;
export default clienteSlice.reducer;