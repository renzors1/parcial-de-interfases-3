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
  peso?: number;
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
  peso?: number;
}

export interface HorarioAtencion {
  dias: number[]; // 1 = Lunes, 2 = Martes, ..., 6 = Sabado, 0 = Domingo
  horaInicio: string; // "HH:MM"
  horaFin: string; // "HH:MM"
}

export interface Veterinario {
  nombreCompleto: string; // Ej: 'Dr. Carlos Mendoza (Medicina General)'
  nombre: string;
  especialidad: string;
  horario: HorarioAtencion;
}

