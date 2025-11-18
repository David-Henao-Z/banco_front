// Interfaces que coinciden exactamente con los modelos del backend FastAPI

// ========================
// ENUMS
// ========================
export enum TipoCuenta {
  AHORROS = 'AHORROS',
  CORRIENTE = 'CORRIENTE'
}

export enum TransaccionTipo {
  DEPOSITO = 'DEPOSITO',
  RETIRO = 'RETIRO',
  TRANSFERENCIA = 'TRANSFERENCIA'
}

// ========================
// CLIENTE
// ========================
export interface Cliente {
  id: string;
  nombre_completo: string;
  documento: string;
  fecha_creacion: string;
  fecha_edicion?: string | null;
}

export interface ClienteCreate {
  nombre_completo: string;
  documento: string;
}

// ========================
// TIPO DE CUENTA
// ========================
export interface TipoCuentaModel {
  id: string;
  nombre: string;
  descripcion?: string | null;
}

// ========================
// CUENTA
// ========================
export interface Cuenta {
  id: string;
  numero: string;
  id_cliente: string;
  id_tipo_cuenta: string;
  saldo: number;
  fecha_creacion: string;
  fecha_edicion?: string | null;
}

export interface CuentaCreate {
  id_cliente: string;
  id_tipo_cuenta: string;
}

// ========================
// TRANSACCION
// ========================
export interface Transaccion {
  id: string;
  tipo: TransaccionTipo;
  id_cuenta_origen?: string | null;
  id_cuenta_destino?: string | null;
  monto: number;
  momento: string;
  fecha_creacion: string;
  fecha_edicion?: string | null;
}

export interface Deposito {
  id_cuenta: string;
  monto: number;
}

export interface Retiro {
  id_cuenta: string;
  monto: number;
}

export interface Transferencia {
  id_cuenta_origen: string;
  id_cuenta_destino: string;
  monto: number;
}

// ========================
// API RESPONSES
// ========================
export interface ApiError {
  detail: string;
  status_code?: number;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

// ========================
// QUERY PARAMETERS
// ========================
export interface CuentasQueryParams {
  cliente_id?: string;
  tipo?: TipoCuenta;
}

export interface TransaccionesQueryParams {
  cuenta_id?: string;
  tipo?: TransaccionTipo;
  fecha_desde?: string;
  fecha_hasta?: string;
  limite?: number;
  offset?: number;
}