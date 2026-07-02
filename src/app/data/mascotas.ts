import { Mascota } from '../models/clinica';

export const MASCOTAS_INICIALES: Mascota[] = [
  {
    id: 'm1',
    nombre: 'Toby',
    especie: 'Canino',
    raza: 'Golden Retriever',
    edad: 3,
    dueno: 'Juan Perez',
    telefono: '987654321',
    duenoEmail: 'cliente@vetcare.com',
    fechaRegistro: new Date().toLocaleDateString()
  },
  {
    id: 'm2',
    nombre: 'Luna',
    especie: 'Felino',
    raza: 'Siamés',
    edad: 2,
    dueno: 'Juan Perez',
    telefono: '987654321',
    duenoEmail: 'cliente@vetcare.com',
    fechaRegistro: new Date().toLocaleDateString()
  },
  {
    id: 'm3',
    nombre: 'Rocky',
    especie: 'Canino',
    raza: 'Pastor Alemán',
    edad: 5,
    dueno: 'Maria Gomez',
    telefono: '999888777',
    duenoEmail: 'maria@vetcare.com',
    fechaRegistro: new Date().toLocaleDateString()
  }
];
