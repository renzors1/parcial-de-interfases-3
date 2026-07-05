import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { StorageService } from './storage.service';
import { USUARIOS_INICIALES } from '../data/usuarios';
import { Veterinario } from '../models/clinica';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly USERS_KEY = 'usuarios';
  private readonly ACTIVE_USER_KEY = 'usuarioActivo';
  private usuarioActivoSubject = new BehaviorSubject<any>(null);

  constructor(
    private storageService: StorageService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.inicializarUsuarios();
      this.cargarUsuarioActivoDesdeStorage();
    }
  }

  private cargarUsuarioActivoDesdeStorage(): void {
    const usuario = this.storageService.getItem<any>(this.ACTIVE_USER_KEY);
    this.usuarioActivoSubject.next(usuario);
  }

  private inicializarUsuarios(): void {
    let usuarios = this.getUsuarios();
    
    let huboCambios = false;
    USUARIOS_INICIALES.forEach(usuarioPrueba => {
      const existe = usuarios.some((u: any) => u.correo === usuarioPrueba.correo);
      if (!existe) {
        usuarios.push(usuarioPrueba);
        huboCambios = true;
      }
    });
    
    if (huboCambios) {
      this.storageService.setItem(this.USERS_KEY, usuarios);
    }
  }

  getUsuarios(): any[] {
    const usuarios = this.storageService.getItem<any[]>(this.USERS_KEY);
    return Array.isArray(usuarios) ? usuarios : [];
  }

  login(correo: string, password: string): any {
    const usuarios = this.getUsuarios();
    const correoLimpio = (correo || '').trim().toLowerCase();
    const usuario = usuarios.find((u: any) => {
      const uCorreo = (u.correo || '').trim().toLowerCase();
      return uCorreo === correoLimpio && u.password === password;
    });
    
    if (usuario) {
      this.storageService.setItem(this.ACTIVE_USER_KEY, usuario);
      this.usuarioActivoSubject.next(usuario);
    }
    return usuario;
  }

  logout(): void {
    this.storageService.removeItem(this.ACTIVE_USER_KEY);
    this.usuarioActivoSubject.next(null);
  }

  getUsuarioActivo(): any {
    return this.usuarioActivoSubject.value;
  }

  getUsuarioActivo$(): Observable<any> {
    return this.usuarioActivoSubject.asObservable();
  }

  registrarUsuario(usuario: any): boolean {
    const usuarios = this.getUsuarios();
    const existe = usuarios.find(u => u.correo === usuario.correo);
    if (existe) {
      return false;
    }
    usuarios.push(usuario);
    this.storageService.setItem(this.USERS_KEY, usuarios);
    return true;
  }

  sincronizarUsuarioDeVeterinario(veterinario: Veterinario): void {
    let usuarios = this.getUsuarios();
    
    const idx = usuarios.findIndex((u: any) => u.veterinarioAsociado === veterinario.nombreCompleto);
    
    if (idx !== -1) {
      usuarios[idx].correo = veterinario.correoInstitucional;
      usuarios[idx].password = veterinario.password;
    } else {
      usuarios.push({
        nombre: veterinario.nombreCompleto,
        correo: veterinario.correoInstitucional,
        password: veterinario.password,
        rol: 'VETERINARIO',
        veterinarioAsociado: veterinario.nombreCompleto
      });
    }
    this.storageService.setItem(this.USERS_KEY, usuarios);
  }
}
