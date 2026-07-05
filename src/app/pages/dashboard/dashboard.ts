import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Navbar } from '../../shared/navbar/navbar';
import { Footer } from '../../shared/footer/footer';
import { MascotasService } from '../../services/mascotas.service';
import { CitasService } from '../../services/citas.service';
import { AuthService } from '../../services/auth.service';
import { VeterinariosService } from '../../services/veterinarios.service';
import { Cita, Veterinario } from '../../models/clinica';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, Navbar, Footer],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit, OnDestroy {
  totalMascotas: number = 0;
  totalCitas: number = 0;
  totalVeterinarios: number = 0;
  
  // Variables de negocio para Admin
  adminTotalMascotas: number = 0;
  adminTotalCitas: number = 0;
  adminCitasPendientes: number = 0;
  adminCitasAtendidas: number = 0;

  citasRecientes: Cita[] = [];
  veterinariosRecientes: any[] = [];
  esVeterinario: boolean = false;
  vetNombre: string = '';
  private authSub: Subscription | null = null;

  constructor(
    private mascotasService: MascotasService,
    private citasService: CitasService,
    private authService: AuthService,
    private veterinariosService: VeterinariosService
  ) {}

  ngOnInit(): void {
    this.authSub = this.authService.getUsuarioActivo$().subscribe(activo => {
      this.cargarDatosDashboard(activo);
    });
  }

  ngOnDestroy(): void {
    if (this.authSub) {
      this.authSub.unsubscribe();
    }
  }

  private cargarDatosDashboard(activo: any): void {
    let vetAsociado = '';
    
    if (activo) {
      this.esVeterinario = activo.rol === 'VETERINARIO';
      vetAsociado = activo.veterinarioAsociado || '';
      this.vetNombre = activo.nombre || '';
    } else {
      this.esVeterinario = false;
    }

    if (this.esVeterinario) {
      const mascotas = this.mascotasService.getMascotas();
      this.totalMascotas = mascotas.length;

      const citas = this.citasService.getCitas();
      const citasVet = citas.filter(c => c.veterinario === vetAsociado && c.estado !== 'Atendida');
      this.totalCitas = citasVet.length;
      this.citasRecientes = citas.filter(c => c.veterinario === vetAsociado).slice(-5).reverse();
    } else {
      // Para el Admin: Métricas de Negocio
      const veterinarios = this.veterinariosService.getVeterinarios();
      const todasCitas = this.citasService.getCitas();
      const mascotas = this.mascotasService.getMascotas();
      
      this.totalVeterinarios = veterinarios.length;
      this.adminTotalMascotas = mascotas.length;
      this.adminTotalCitas = todasCitas.length;
      this.adminCitasPendientes = todasCitas.filter(c => c.estado !== 'Atendida').length;
      this.adminCitasAtendidas = todasCitas.filter(c => c.estado === 'Atendida').length;
      
      // Mapeamos los veterinarios para incluir estadísticas de citas
      this.veterinariosRecientes = veterinarios.map(vet => {
        const citasVet = todasCitas.filter(c => c.veterinario === vet.nombreCompleto);
        const pendientes = citasVet.filter(c => c.estado !== 'Atendida').length;
        const atendidas = citasVet.filter(c => c.estado === 'Atendida').length;
        return { ...vet, pendientes, atendidas } as any;
      }).slice(-5).reverse();
    }
  }
}
