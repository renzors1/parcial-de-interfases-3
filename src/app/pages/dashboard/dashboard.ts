import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Navbar } from '../../shared/navbar/navbar';
import { Footer } from '../../shared/footer/footer';
import { ClinicaService } from '../../services/clinica.service';
import { Cita } from '../../models/clinica';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, Navbar, Footer],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  totalMascotas: number = 0;
  totalCitas: number = 0;
  citasRecientes: Cita[] = [];
  esVeterinario: boolean = false;
  vetNombre: string = '';

  constructor(private clinicaService: ClinicaService) {}

  ngOnInit(): void {
    let vetAsociado = '';
    if (typeof localStorage !== 'undefined') {
      const activo = JSON.parse(localStorage.getItem('usuarioActivo') || '{}');
      if (activo) {
        this.esVeterinario = activo.rol === 'VETERINARIO';
        vetAsociado = activo.veterinarioAsociado || '';
        this.vetNombre = activo.nombre || '';
      }
    }

    const mascotas = this.clinicaService.getMascotas();
    const citas = this.clinicaService.getCitas();
    
    this.totalMascotas = mascotas.length;

    if (this.esVeterinario) {
      const citasVet = citas.filter(c => c.veterinario === vetAsociado);
      this.totalCitas = citasVet.length;
      this.citasRecientes = citasVet.slice(-5).reverse();
    } else {
      this.totalCitas = citas.length;
      this.citasRecientes = citas.slice(-5).reverse();
    }
  }
}
