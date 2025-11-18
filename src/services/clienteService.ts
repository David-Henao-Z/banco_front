import { apiClient } from './api';
import { Cliente, ClienteCreate } from '@/interfaces';

export class ClienteService {
  /**
   * Obtener todos los clientes
   */
  static async listar(): Promise<Cliente[]> {
    const response = await apiClient.get<Cliente[]>('/clientes');
    return response.data;
  }

  /**
   * Obtener un cliente por ID
   */
  static async obtener(id: string): Promise<Cliente> {
    const response = await apiClient.get<Cliente>(`/clientes/${id}`);
    return response.data;
  }

  /**
   * Crear un nuevo cliente
   */
  static async crear(cliente: ClienteCreate): Promise<Cliente> {
    const response = await apiClient.post<Cliente>('/clientes', cliente);
    return response.data;
  }

  /**
   * Actualizar un cliente existente
   */
  static async actualizar(id: string, cliente: ClienteCreate): Promise<Cliente> {
    const response = await apiClient.put<Cliente>(`/clientes/${id}`, cliente);
    return response.data;
  }

  /**
   * Eliminar un cliente
   */
  static async eliminar(id: string): Promise<void> {
    await apiClient.delete(`/clientes/${id}`);
  }
}