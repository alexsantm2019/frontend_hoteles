export interface Producto {
  id?: number;
  nombre: string;
  categoria?: string;
  precio_compra: number;
  precio_venta: number;
  stock_minimo: number;
  activo: boolean;
}

export interface Consumo {
  id?: number;
  reserva: number;
  producto: number;
  producto_nombre?: string;
  cantidad: number;
  precio_venta_snapshot: number;
  total?: number;
}
