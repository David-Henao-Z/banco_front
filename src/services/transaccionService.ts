import { apiClient } from './api';
import { 
  Transaccion, 
  Deposito, 
  Retiro, 
  Transferencia,
  TransaccionesQueryParams 
} from '@/interfaces';

export class TransaccionService {
  /**
   * Obtener todas las transacciones con filtros opcionales
   */
  static async listar(params?: TransaccionesQueryParams): Promise<Transaccion[]> {
    const response = await apiClient.get<Transaccion[]>('/transacciones', { params });
    return response.data;
  }

  /**
   * Obtener una transacción por ID
   */
  static async obtener(id: string): Promise<Transaccion> {
    const response = await apiClient.get<Transaccion>(`/transacciones/${id}`);
    return response.data;
  }

  /**
   * Realizar un depósito
   */
  static async depositar(deposito: Deposito): Promise<Transaccion> {
    const response = await apiClient.post<Transaccion>('/transacciones/deposito', deposito);
    return response.data;
  }

  /**
   * Realizar un retiro
   */
  static async retirar(retiro: Retiro): Promise<Transaccion> {
    const response = await apiClient.post<Transaccion>('/transacciones/retiro', retiro);
    return response.data;
  }

  /**
   * Realizar una transferencia
   */
  static async transferir(transferencia: Transferencia): Promise<Transaccion> {
    const response = await apiClient.post<Transaccion>('/transacciones/transferencia', transferencia);
    return response.data;
  }

  /**
   * Obtener transacciones de una cuenta específica
   */
  static async obtenerPorCuenta(cuentaId: string): Promise<Transaccion[]> {
    return this.listar({ cuenta_id: cuentaId });
  }

  /**
   * Obtener el historial completo de transacciones con paginación
   */
  static async obtenerHistorial(
    limite: number = 20,
    offset: number = 0,
    filtros?: Omit<TransaccionesQueryParams, 'limite' | 'offset'>
  ): Promise<Transaccion[]> {
    return this.listar({
      ...filtros,
      limite,
      offset
    });
  }
}