import { Cita } from '../models/clinica';

export const CITAS_INICIALES: Cita[] = [
  {
    id: 'c1',
    mascotaId: 'm1',
    mascotaNombre: 'Toby',
    duenoNombre: 'Juan Perez',
    fecha: new Date().toISOString().split('T')[0],
    hora: '10:00',
    veterinario: 'Dr. Carlos Mendoza (Medicina General)',
    motivo: 'Vacunación y control anual',
    estado: 'Pendiente'
  },
  {
    id: 'c2',
    mascotaId: 'm3',
    mascotaNombre: 'Rocky',
    duenoNombre: 'Maria Gomez',
    fecha: new Date().toISOString().split('T')[0],
    hora: '15:30',
    veterinario: 'Dra. Ana Silva (Cirugía y Especialidades)',
    motivo: 'Chequeo de rutina post-operatorio',
    estado: 'Pendiente'
  }
];
