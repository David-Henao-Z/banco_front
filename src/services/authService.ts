import { apiClient } from './api';
import { LoginCredentials, LoginResponse } from '@/interfaces';

export class AuthService {
  /**
   * Realizar login con credenciales
   */
  static async login(credentials: LoginCredentials): Promise<LoginResponse> {
    console.log('🔧 AuthService.login iniciado con:', credentials);
    
    const formData = new URLSearchParams();
    formData.append('username', credentials.username);
    formData.append('password', credentials.password);

    console.log('📤 Enviando petición a /token');
    
    try {
      const response = await apiClient.post<LoginResponse>('/token', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      console.log('✅ Respuesta exitosa del AuthService:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error en AuthService:', error);
      throw error;
    }
  }

  /**
   * Verificar si el usuario actual está autenticado
   */
  static async getCurrentUser(): Promise<any> {
    const response = await apiClient.get('/me');
    return response.data;
  }

  /**
   * Refrescar token (si implementas este endpoint en el backend)
   */
  static async refreshToken(): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>('/refresh');
    return response.data;
  }
}