export interface Hotel {
  id: number;
  nombre: string;
  slug: string;
  direccion: string | null;
  activo: boolean;
  empresa: number;
}

export interface Empresa {
  id: number;
  nombre: string;
  ruc: string;
  direccion?: string | null; 
  telefono?: string | null; 
  correo?: string | null; 
  activa: boolean;
  hoteles: Hotel[];
}

export interface RolUsuarioHotel {
  id: number;
  hotel: Hotel;
  rol: string;
  activo: boolean;
}
export interface Espacio {
  id: number;
  nombre: string;
  activo: boolean;
}

export interface Habitacion {
  id: number;
  numero: string;
  tipo: string;
  precio_base: number;
  capacidad_maxima: number;
  activa: boolean;
  permite_reserva_completa: boolean;
  permite_reserva_espacios: boolean;
  espacios: Espacio[];
}

export interface Piso {
  id: number;
  numero: string;
  habitaciones: Habitacion[];
}

export interface Edificio {
  id: number;
  nombre: string;
  activo: boolean;
  pisos: Piso[];
}
