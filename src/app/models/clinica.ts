export interface Mascota {
  id: string;
  nombre: string;
  especie: string;
  raza: string;
  edad: number;
  dueno: string;
  telefono: string;
  duenoEmail?: string;
  fechaRegistro: string;
}

export interface Cita {
  id: string;
  mascotaId: string;
  mascotaNombre: string;
  duenoNombre: string;
  fecha: string;
  hora: string;
  veterinario: string;
  motivo: string;
  estado: string;
}

export interface EntradaHistorial {
  id: string;
  mascotaId: string;
  fecha: string;
  diagnostico: string;
  tratamiento: string;
  receta: string;
}
