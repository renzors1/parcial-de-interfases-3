import { Veterinario } from '../models/clinica';

export const VETERINARIOS: Veterinario[] = [
  {
    id: 'v1',
    nombreCompleto: 'Carlos Mendoza Rodríguez',
    nombre: 'Dr. Carlos Mendoza',
    especialidad: 'Medicina General',
    horario: {
      dias: [1, 2, 3, 4, 5],
      horaInicio: '08:00',
      horaFin: '16:00'
    },
    activo: true,
    edad: 45,
    dni: '12345678',
    telefono: '987654321',
    correoPersonal: 'carlos.mendoza@gmail.com',
    correoInstitucional: 'carlos@vetcare.com',
    password: '123456',
    direccion: 'Av. Los Próceres 123'
  },
  {
    id: 'v2',
    nombreCompleto: 'Ana Silva Vargas',
    nombre: 'Dra. Ana Silva',
    especialidad: 'Cirugía y Especialidades',
    horario: {
      dias: [1, 2, 3, 4],
      horaInicio: '09:00',
      horaFin: '17:00'
    },
    activo: true,
    edad: 38,
    dni: '87654321',
    telefono: '912345678',
    correoPersonal: 'ana.silva@hotmail.com',
    correoInstitucional: 'ana@vetcare.com',
    password: '123456',
    direccion: 'Jr. Los Claveles 456'
  },
  {
    id: 'v3',
    nombreCompleto: 'Luis Ramos Gutiérrez',
    nombre: 'Dr. Luis Ramos',
    especialidad: 'Dermatología y Control',
    horario: {
      dias: [3, 4, 5, 6],
      horaInicio: '10:00',
      horaFin: '18:00'
    },
    activo: true,
    edad: 52,
    dni: '11223344',
    telefono: '998877665',
    correoPersonal: 'luis.ramos@yahoo.com',
    correoInstitucional: 'luis@vetcare.com',
    password: '123456',
    direccion: 'Calle Los Pinos 789'
  },
  {
    id: 'v4',
    nombreCompleto: 'Sofía Pérez Jiménez',
    nombre: 'Dra. Sofía Pérez',
    especialidad: 'Nutrición y Vacunas',
    horario: {
      dias: [1, 3, 5],
      horaInicio: '08:00',
      horaFin: '14:00'
    },
    activo: true,
    edad: 31,
    dni: '44332211',
    telefono: '955443322',
    correoPersonal: 'sofia.perez@gmail.com',
    correoInstitucional: 'sofia@vetcare.com',
    password: '123456',
    direccion: 'Av. Brasil 1540'
  }
];
