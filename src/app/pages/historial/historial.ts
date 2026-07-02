import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Navbar } from '../../shared/navbar/navbar';
import { Footer } from '../../shared/footer/footer';
import { ClinicaService } from '../../services/clinica.service';
import { Mascota, Cita, EntradaHistorial } from '../../models/clinica';

@Component({
  selector: 'app-historial',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, Navbar, Footer],
  templateUrl: './historial.html',
  styleUrl: './historial.css',
})
export class Historial implements OnInit {
  mascotas: Mascota[] = [];
  historiales: EntradaHistorial[] = [];
  citas: Cita[] = [];

  mascotaSeleccionadaId: string = '';
  mascotaSeleccionada: Mascota | null = null;
  historialFiltrado: EntradaHistorial[] = [];
  citasFiltradas: Cita[] = [];

  diagnostico: string = '';
  tratamiento: string = '';
  receta: string = '';
  esCliente: boolean = false;
  correoActivo: string = '';

  constructor(private clinicaService: ClinicaService) {}

  ngOnInit(): void {
    this.cargarDatosUsuario();
    this.cargarDatos();
  }

  cargarDatosUsuario(): void {
    if (typeof localStorage !== 'undefined') {
      const activo = JSON.parse(localStorage.getItem('usuarioActivo') || '{}');
      if (activo) {
        this.esCliente = activo.rol === 'CLIENTE';
        this.correoActivo = activo.correo || '';
      }
    }
  }

  cargarDatos(): void {
    const todasMascotas = this.clinicaService.getMascotas();
    if (this.esCliente) {
      this.mascotas = todasMascotas.filter(m => m.duenoEmail === this.correoActivo);
    } else {
      this.mascotas = todasMascotas;
    }
    this.citas = this.clinicaService.getCitas();
    this.historiales = this.clinicaService.getHistoriales();
  }

  seleccionarMascota(): void {
    this.mascotaSeleccionada = this.mascotas.find(m => m.id === this.mascotaSeleccionadaId) || null;
    if (this.mascotaSeleccionada) {
      this.filtrarHistorial();
    } else {
      this.historialFiltrado = [];
      this.citasFiltradas = [];
    }
  }

  filtrarHistorial(): void {
    this.historialFiltrado = this.historiales.filter(h => h.mascotaId === this.mascotaSeleccionadaId);
    this.citasFiltradas = this.citas.filter(c => c.mascotaId === this.mascotaSeleccionadaId);
  }

  registrarEntrada(): void {
    if (!this.mascotaSeleccionadaId || !this.diagnostico || !this.tratamiento) {
      alert('Por favor complete el diagnóstico y tratamiento.');
      return;
    }

    const nuevaEntrada: EntradaHistorial = {
      id: Date.now().toString(),
      mascotaId: this.mascotaSeleccionadaId,
      fecha: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      diagnostico: this.diagnostico,
      tratamiento: this.tratamiento,
      receta: this.receta || 'Ninguna'
    };

    this.clinicaService.saveHistorial(nuevaEntrada);
    this.cargarDatos();
    this.diagnostico = '';
    this.tratamiento = '';
    this.receta = '';

    this.filtrarHistorial();
    alert('Entrada agregada al historial correctamente.');
  }

  eliminarEntrada(id: string): void {
    this.clinicaService.deleteHistorial(id);
    this.cargarDatos();
    this.filtrarHistorial();
  }
}
