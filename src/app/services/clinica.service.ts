import { Injectable } from '@angular/core';
import { Mascota, Cita, EntradaHistorial, Veterinario } from '../models/clinica';
import { MASCOTAS_INICIALES } from '../data/mascotas';
import { CITAS_INICIALES } from '../data/citas';
import { HISTORIALES_INICIALES } from '../data/historiales';
import { VETERINARIOS } from '../data/veterinarios';

@Injectable({
  providedIn: 'root'
})
export class ClinicaService {

  getVeterinarios(): Veterinario[] {
    return VETERINARIOS;
  }


  getMascotas(): Mascota[] {
    if (typeof localStorage === 'undefined') return [];
    
    if (!localStorage.getItem('mascotas')) {
      localStorage.setItem('mascotas', JSON.stringify(MASCOTAS_INICIALES));
    }
    return JSON.parse(localStorage.getItem('mascotas') || '[]');
  }

  saveMascota(mascota: Mascota): void {
    if (typeof localStorage === 'undefined') return;
    const mascotas = this.getMascotas();
    mascotas.push(mascota);
    localStorage.setItem('mascotas', JSON.stringify(mascotas));
  }

  deleteMascota(id: string): void {
    if (typeof localStorage === 'undefined') return;
    let mascotas = this.getMascotas();
    mascotas = mascotas.filter(m => m.id !== id);
    localStorage.setItem('mascotas', JSON.stringify(mascotas));
  }

  getCitas(): Cita[] {
    if (typeof localStorage === 'undefined') return [];

    if (!localStorage.getItem('citas')) {
      localStorage.setItem('citas', JSON.stringify(CITAS_INICIALES));
    }
    return JSON.parse(localStorage.getItem('citas') || '[]');
  }

  saveCita(cita: Cita): void {
    if (typeof localStorage === 'undefined') return;
    const citas = this.getCitas();
    citas.push(cita);
    localStorage.setItem('citas', JSON.stringify(citas));
  }

  deleteCita(id: string): void {
    if (typeof localStorage === 'undefined') return;
    let citas = this.getCitas();
    citas = citas.filter(c => c.id !== id);
    localStorage.setItem('citas', JSON.stringify(citas));
  }

  getHistoriales(): EntradaHistorial[] {
    if (typeof localStorage === 'undefined') return [];

    if (!localStorage.getItem('historiales')) {
      localStorage.setItem('historiales', JSON.stringify(HISTORIALES_INICIALES));
    }
    return JSON.parse(localStorage.getItem('historiales') || '[]');
  }

  saveHistorial(entrada: EntradaHistorial): void {
    if (typeof localStorage === 'undefined') return;
    const historiales = this.getHistoriales();
    historiales.push(entrada);
    localStorage.setItem('historiales', JSON.stringify(historiales));
  }

  deleteHistorial(id: string): void {
    if (typeof localStorage === 'undefined') return;
    let historiales = this.getHistoriales();
    historiales = historiales.filter(h => h.id !== id);
    localStorage.setItem('historiales', JSON.stringify(historiales));
  }

  updateMascotaPeso(id: string, peso: number): void {
    if (typeof localStorage === 'undefined') return;
    const mascotas = this.getMascotas();
    const idx = mascotas.findIndex(m => m.id === id);
    if (idx !== -1) {
      mascotas[idx].peso = peso;
      localStorage.setItem('mascotas', JSON.stringify(mascotas));
    }
  }

  updateCitaEstado(id: string, estado: string): void {
    if (typeof localStorage === 'undefined') return;
    const citas = this.getCitas();
    const idx = citas.findIndex(c => c.id === id);
    if (idx !== -1) {
      citas[idx].estado = estado;
      localStorage.setItem('citas', JSON.stringify(citas));
    }
  }
}
