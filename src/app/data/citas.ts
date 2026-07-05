import { Cita } from '../models/clinica';

export const CITAS_INICIALES: Cita[] = [
  {
    id: 'c1',
    mascotaId: 'm1',
    mascotaNombre: 'Toby',
    duenoNombre: 'Juan Perez',
    fecha: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Mañana
    hora: '10:00',
    veterinario: 'Carlos Mendoza Rodríguez',
    motivo: 'Control general y desparasitación',
    estado: 'Pendiente'
  },
  {
    id: 'c2',
    mascotaId: 'm3',
    mascotaNombre: 'Rocky',
    duenoNombre: 'Maria Gomez',
    fecha: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0], // Pasado mañana
    hora: '11:00',
    veterinario: 'Ana Silva Vargas',
    motivo: 'Evaluación quirúrgica',
    estado: 'Pendiente'
  },
  {
    id: 'c3',
    mascotaId: 'm2',
    mascotaNombre: 'Luna',
    duenoNombre: 'Juan Perez',
    fecha: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Mañana
    hora: '14:00',
    veterinario: 'Luis Ramos Gutiérrez',
    motivo: 'Chequeo dermatológico (Alergia)',
    estado: 'Pendiente'
  },
  {
    id: 'c4',
    mascotaId: 'm1',
    mascotaNombre: 'Toby',
    duenoNombre: 'Juan Perez',
    fecha: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0], // En 3 días
    hora: '09:00',
    veterinario: 'Sofía Pérez Jiménez',
    motivo: 'Asesoría nutricional',
    estado: 'Pendiente'
  }
];
