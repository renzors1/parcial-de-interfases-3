import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { Cita } from '../models/clinica';
import { CITAS_INICIALES } from '../data/citas';

@Injectable({
  providedIn: 'root'
})
export class CitasService {
  private readonly CITAS_KEY = 'citas';

  constructor(private storageService: StorageService) { }

  getCitas(): Cita[] {
    let citas = this.storageService.getItem<Cita[]>(this.CITAS_KEY);
    if (!citas || !Array.isArray(citas)) {
      this.storageService.setItem(this.CITAS_KEY, CITAS_INICIALES);
      citas = CITAS_INICIALES;
    }
    return citas;
  }

  saveCita(cita: Cita): void {
    const citas = this.getCitas();
    citas.push(cita);
    this.storageService.setItem(this.CITAS_KEY, citas);
  }

  deleteCita(id: string): void {
    let citas = this.getCitas();
    citas = citas.filter(c => c.id !== id);
    this.storageService.setItem(this.CITAS_KEY, citas);
  }

  updateCitaEstado(id: string, nuevoEstado: string): void {
    const citas = this.getCitas();
    const idx = citas.findIndex(c => c.id === id);
    if (idx !== -1) {
      citas[idx].estado = nuevoEstado;
      this.storageService.setItem(this.CITAS_KEY, citas);
    }
  }
}
