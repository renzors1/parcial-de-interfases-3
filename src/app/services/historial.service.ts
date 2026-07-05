import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { EntradaHistorial } from '../models/clinica';
import { HISTORIALES_INICIALES } from '../data/historiales';

@Injectable({
  providedIn: 'root'
})
export class HistorialService {
  private readonly HISTORIAL_KEY = 'historiales';

  constructor(private storageService: StorageService) { }

  getHistoriales(): EntradaHistorial[] {
    let historiales = this.storageService.getItem<EntradaHistorial[]>(this.HISTORIAL_KEY);
    if (!historiales) {
      this.storageService.setItem(this.HISTORIAL_KEY, HISTORIALES_INICIALES);
      historiales = HISTORIALES_INICIALES;
    }
    return historiales;
  }

  saveHistorial(entrada: EntradaHistorial): void {
    const historiales = this.getHistoriales();
    historiales.push(entrada);
    this.storageService.setItem(this.HISTORIAL_KEY, historiales);
  }

  deleteHistorial(id: string): void {
    let historiales = this.getHistoriales();
    historiales = historiales.filter(h => h.id !== id);
    this.storageService.setItem(this.HISTORIAL_KEY, historiales);
  }
}
