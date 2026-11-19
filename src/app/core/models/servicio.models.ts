export interface Servicio {
  id?: number;
  nombre: string;
  descripcion?: string;
  precio: number;
  unidad_cobro: string;
  activo: boolean;
}

export interface DetalleServicioReserva {
  id?: number;
  reserva: number;
  servicio: number;
  nombre_servicio?: string;
  cantidad: number;
  precio_unitario_snapshot: number;
  total?: number;
}
