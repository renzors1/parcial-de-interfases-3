import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { Mascota } from '../models/clinica';
import { MASCOTAS_INICIALES } from '../data/mascotas';

@Injectable({
  providedIn: 'root'
})
export class MascotasService {
  private readonly MASCOTAS_KEY = 'mascotas';

  constructor(private storageService: StorageService) { }

  getMascotas(): Mascota[] {
    let mascotas = this.storageService.getItem<Mascota[]>(this.MASCOTAS_KEY);
    if (!mascotas || !Array.isArray(mascotas)) {
      this.storageService.setItem(this.MASCOTAS_KEY, MASCOTAS_INICIALES);
      mascotas = MASCOTAS_INICIALES;
    }
    return mascotas;
  }

  saveMascota(mascota: Mascota): void {
    const mascotas = this.getMascotas();
    mascotas.push(mascota);
    this.storageService.setItem(this.MASCOTAS_KEY, mascotas);
  }

  deleteMascota(id: string): void {
    let mascotas = this.getMascotas();
    mascotas = mascotas.filter(m => m.id !== id);
    this.storageService.setItem(this.MASCOTAS_KEY, mascotas);
  }

  updateMascotaPeso(mascotaId: string, peso: number): void {
    const mascotas = this.getMascotas();
    const idx = mascotas.findIndex(m => m.id === mascotaId);
    if (idx !== -1) {
      mascotas[idx].peso = peso;
      this.storageService.setItem(this.MASCOTAS_KEY, mascotas);
    }
  }
}
