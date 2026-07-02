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

  constructor(private clinicaService: ClinicaService) {}

  ngOnInit(): void {
    const mascotas = this.clinicaService.getMascotas();
    const citas = this.clinicaService.getCitas();
    
    this.totalMascotas = mascotas.length;
    this.totalCitas = citas.length;
    this.citasRecientes = citas.slice(-5).reverse();
  }
}
