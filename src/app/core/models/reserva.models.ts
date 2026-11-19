import { Pago } from "./pago.models";
import { Consumo } from './inventario.models';
import { DetalleServicioReserva } from './servicio.models';

export interface Huesped {
  id?: number;
  nombres: string;
  apellidos: string;
  tipo_documento: string;
  documento: string;
  email?: string;
  telefono?: string;
}

export interface DetalleReserva {
  id?: number;
  habitacion: number;
  espacio?: number | null;
  precio_base_habitacion: number;
}

export interface Reserva {
  id?: number;
  codigo?: string;
  huesped_titular: number;
  huesped_titular_nombre?: string;
  modalidad: string;
  estado: string;
  fecha_entrada: string;
  fecha_salida: string;

  // Nuevos campos
  cantidad_adultos: number;
  cantidad_ninos: number;
  subtotal_calculado: number;
  subtotal_final: number;
  descuento: number;
  impuestos: number;
  total: number;
  motivo_ajuste?: string;

  detalles: DetalleReserva[];
  acompanantes?: Acompanante[];

  pagos?: Pago[];
  total_pagado?: number;
  saldo_pendiente?: number;
  servicios_extra?: DetalleServicioReserva[];
  consumos_inventario?: Consumo[];
}

export interface Acompanante {
  id?: number;
  nombres: string;
  apellidos: string;
  es_nino: boolean;
  documento?: string;
}
