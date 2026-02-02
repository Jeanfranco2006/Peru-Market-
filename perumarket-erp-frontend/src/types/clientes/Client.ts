import { Persona } from './../Employee';
// Persona base
export interface Persona {
  id?: number;
  tipoDocumento: string;
  numeroDocumento: string;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  correo: string;
  telefono: string;
  fechaNacimiento?: string;
  direccion: string;
}

// Cliente
export interface Cliente {
  id?: number;
  tipo: string;
  fechaCreacion?: string;
  fechaActualizacion?: string;
  estado?: string;
  persona: Persona;
}

// Filtros
export interface ClienteFilters {
  texto: string;
  id?: number;
  tipo: string;
}

// Estadísticas
export interface ClienteStats {
  total: number;
  activos: number;
  filtrados: number;
}

export type TipoCliente = 'NATURAL' | 'JURIDICA' | string;