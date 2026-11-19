export interface TurnoCaja {
  id?: number;
  hotel?: number;
  usuario_apertura?: number;
  usuario_apertura_nombre?: string;
  usuario_cierre?: number;
  fecha_apertura?: string;
  fecha_cierre?: string;
  saldo_inicial: number;
  saldo_final_calculado?: number;
  saldo_final_real?: number;
  saldo_esperado_actual?: number;
  diferencia?: number;
  estado: 'abierta' | 'cerrada';
  observaciones?: string;
}
