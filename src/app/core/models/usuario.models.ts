export interface Usuario {
  id: number;
  username: string;
  email: string | null;
  full_name: string;
  identificacion: string | null;
  departamento_id: number | null;
  departamento_nombre: string | null;
  cargo: string | null;
}

export interface UsuarioEquipo {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  rol_nombre?: string;
  hoteles_nombres?: string[];
}