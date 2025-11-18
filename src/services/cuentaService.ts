import { apiClient } from './api';
import { Cuenta, CuentaCreate, CuentasQueryParams, TipoCuentaModel } from '@/interfaces';

export class CuentaService {
  /**
   * Obtener todas las cuentas con filtros opcionales
   */
  static async listar(params?: CuentasQueryParams): Promise<Cuenta[]> {
    const response = await apiClient.get<Cuenta[]>('/cuentas', { params });
    return response.data;
  }

  /**
   * Obtener una cuenta por ID
   */
  static async obtener(id: string): Promise<Cuenta> {
    const response = await apiClient.get<Cuenta>(`/cuentas/${id}`);
    return response.data;
  }

  /**
   * Crear una nueva cuenta
   */
  static async crear(cuenta: CuentaCreate): Promise<Cuenta> {
    const response = await apiClient.post<Cuenta>('/cuentas', cuenta);
    return response.data;
  }

  /**
   * Actualizar una cuenta existente
   */
  static async actualizar(id: string, cuenta: CuentaCreate): Promise<Cuenta> {
    const response = await apiClient.put<Cuenta>(`/cuentas/${id}`, cuenta);
    return response.data;
  }

  /**
   * Eliminar una cuenta
   */
  static async eliminar(id: string): Promise<void> {
    await apiClient.delete(`/cuentas/${id}`);
  }

  /**
   * Obtener cuentas de un cliente específico
   */
  static async obtenerPorCliente(clienteId: string): Promise<Cuenta[]> {
    return this.listar({ cliente_id: clienteId });
  }
}

export class TipoCuentaService {
  /**
   * Obtener todos los tipos de cuenta disponibles
   */
  static async listar(): Promise<TipoCuentaModel[]> {
    const response = await apiClient.get<TipoCuentaModel[]>('/tipos-cuenta');
    return response.data;
  }

  /**
   * Obtener un tipo de cuenta por ID
   */
  static async obtener(id: string): Promise<TipoCuentaModel> {
    const response = await apiClient.get<TipoCuentaModel>(`/tipos-cuenta/${id}`);
    return response.data;
  }
}