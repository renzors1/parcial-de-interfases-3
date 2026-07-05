import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { AuthService } from './auth.service';
import { Veterinario } from '../models/clinica';
import { VETERINARIOS } from '../data/veterinarios';

@Injectable({
  providedIn: 'root'
})
export class VeterinariosService {
  private readonly VET_KEY = 'veterinarios';

  constructor(
    private storageService: StorageService,
    private authService: AuthService
  ) { }

  getVeterinarios(): Veterinario[] {
    let guardados = this.storageService.getRawItem(this.VET_KEY);
    
    if (!guardados || (guardados && !JSON.parse(guardados)[0]?.edad)) {
      this.storageService.setItem(this.VET_KEY, VETERINARIOS);
      guardados = this.storageService.getRawItem(this.VET_KEY);
    }
    
    return guardados ? JSON.parse(guardados) : [];
  }

  saveVeterinario(veterinario: Veterinario): void {
    const veterinarios = this.getVeterinarios();
    veterinarios.push(veterinario);
    this.storageService.setItem(this.VET_KEY, veterinarios);
    this.authService.sincronizarUsuarioDeVeterinario(veterinario);
  }

  updateVeterinario(veterinario: Veterinario): void {
    const veterinarios = this.getVeterinarios();
    const idx = veterinarios.findIndex(v => v.id === veterinario.id);
    if (idx !== -1) {
      veterinarios[idx] = veterinario;
      this.storageService.setItem(this.VET_KEY, veterinarios);
      this.authService.sincronizarUsuarioDeVeterinario(veterinario);
    }
  }

  toggleVeterinarioStatus(id: string): void {
    const veterinarios = this.getVeterinarios();
    const idx = veterinarios.findIndex(v => v.id === id);
    if (idx !== -1) {
      veterinarios[idx].activo = !veterinarios[idx].activo;
      this.storageService.setItem(this.VET_KEY, veterinarios);
    }
  }
}
