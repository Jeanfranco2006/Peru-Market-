import type { Persona } from "./Employee";

export interface Cliente{
    clienteid?: number;
    persona: Persona;
    tipo: string;
    fechaCreacion: string;
    fechaActualizacion: string;
}