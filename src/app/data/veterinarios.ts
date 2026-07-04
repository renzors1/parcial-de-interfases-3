import { Veterinario } from '../models/clinica';

export const VETERINARIOS: Veterinario[] = [
  {
    nombreCompleto: 'Dr. Carlos Mendoza (Medicina General)',
    nombre: 'Carlos Mendoza',
    especialidad: 'Medicina General',
    horario: {
      dias: [1, 2, 3, 4, 5], // Lunes a Viernes
      horaInicio: '08:00',
      horaFin: '16:00'
    }
  },
  {
    nombreCompleto: 'Dra. Ana Silva (Cirugía y Especialidades)',
    nombre: 'Ana Silva',
    especialidad: 'Cirugía y Especialidades',
    horario: {
      dias: [1, 2, 3, 4], // Lunes a Jueves
      horaInicio: '09:00',
      horaFin: '17:00'
    }
  },
  {
    nombreCompleto: 'Dr. Luis Ramos (Dermatología y Control)',
    nombre: 'Luis Ramos',
    especialidad: 'Dermatología y Control',
    horario: {
      dias: [3, 4, 5, 6], // Miercoles a Sabado
      horaInicio: '10:00',
      horaFin: '18:00'
    }
  },
  {
    nombreCompleto: 'Dra. Sofía Pérez (Nutrición y Vacunas)',
    nombre: 'Sofía Pérez',
    especialidad: 'Nutrición y Vacunas',
    horario: {
      dias: [1, 3, 5], // Lunes, Miercoles, Viernes
      horaInicio: '08:00',
      horaFin: '14:00'
    }
  }
];
