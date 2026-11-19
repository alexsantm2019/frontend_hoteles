export interface Temporada {
  id?: number;
  nombre: string;
  fecha_inicio: string;
  fecha_fin: string;
  habitaciones: number[];
  habitaciones_detalle?: string;
  precio_especial: number;
  iva_porcentaje: number;
  activa: boolean;
}
