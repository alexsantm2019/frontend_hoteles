export interface Configuracion {
  id?: number;
  clave: string;
  valor: string;
  catalogo: number;
  descripcion?: string;
  color?: string;
  es_default: boolean;
}