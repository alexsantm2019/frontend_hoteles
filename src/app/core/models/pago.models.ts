export interface Pago {
  id?: number;
  reserva: number; // ID de la reserva a la que pertenece
  monto: number;
  metodo: string;
  referencia?: string;
  fecha_pago?: string; // ISO String
}
