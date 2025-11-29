import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { store } from '@/store';
import { logoutUser } from '@/store/authSlice';

// Configuración base de la API
const API_BASE_URL = 'http://127.0.0.1:8000';

// Instancia principal de Axios
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  // No establecemos Content-Type por defecto para permitir que cada request lo configure
});

// Interceptor para agregar el token automáticamente
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const state = store.getState();
    const token = state.auth.token;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas y errores
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    // Si el token expiró o es inválido, cerrar sesión automáticamente
    if (error.response?.status === 401) {
      store.dispatch(logoutUser());
    }
    
    return Promise.reject(error);
  }
);

export { apiClient, API_BASE_URL };