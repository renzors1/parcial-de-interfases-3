import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Navbar } from '../../shared/navbar/navbar';
import { Footer } from '../../shared/footer/footer';
import { HistorialService } from '../../services/historial.service';
import { CitasService } from '../../services/citas.service';
import { MascotasService } from '../../services/mascotas.service';
import { AuthService } from '../../services/auth.service';
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
  atencionPeso: number | null = null;
  esCliente: boolean = false;
  esVeterinario: boolean = false;
  correoActivo: string = '';

  constructor(
    private historialService: HistorialService,
    private citasService: CitasService,
    private mascotasService: MascotasService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.cargarDatosUsuario();
    this.cargarDatos();
  }

  cargarDatosUsuario(): void {
    const activo = this.authService.getUsuarioActivo();
    if (activo) {
      this.esCliente = activo.rol === 'CLIENTE';
      this.esVeterinario = activo.rol === 'VETERINARIO';
      this.correoActivo = activo.correo || '';
    }
  }

  cargarDatos(): void {
    const todasMascotas = this.mascotasService.getMascotas();
    if (this.esCliente) {
      this.mascotas = todasMascotas.filter(m => m.duenoEmail === this.correoActivo);
    } else {
      this.mascotas = todasMascotas;
    }
    this.citas = this.citasService.getCitas();
    this.historiales = this.historialService.getHistoriales();
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

    if (this.atencionPeso !== null && this.atencionPeso > 0) {
      this.mascotasService.updateMascotaPeso(this.mascotaSeleccionadaId, this.atencionPeso);
    }

    const nuevaEntrada: EntradaHistorial = {
      id: Date.now().toString(),
      mascotaId: this.mascotaSeleccionadaId,
      fecha: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      diagnostico: this.diagnostico,
      tratamiento: this.tratamiento,
      receta: this.receta || 'Ninguna',
      peso: this.atencionPeso || undefined
    };

    this.historialService.saveHistorial(nuevaEntrada);
    this.cargarDatos();
    this.filtrarHistorial();

    this.diagnostico = '';
    this.tratamiento = '';
    this.receta = '';
    this.atencionPeso = null;

    alert('Atención médica registrada correctamente en el historial.');
  }

  eliminarEntrada(id: string): void {
    if (confirm('¿Está seguro de eliminar este registro del historial?')) {
      this.historialService.deleteHistorial(id);
      this.cargarDatos();
      this.filtrarHistorial();
    }
  }

  filtrarDiagnostico(event: Event): void {
    const input = event.target as HTMLTextAreaElement;
    const regex = /[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ\s\.,;:!\?\-\(\)]/g;
    this.diagnostico = input.value.replace(regex, '');
  }

  filtrarTratamiento(event: Event): void {
    const input = event.target as HTMLTextAreaElement;
    const regex = /[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ\s\.,;:!\?\-\(\)]/g;
    this.tratamiento = input.value.replace(regex, '');
  }

  filtrarReceta(event: Event): void {
    const input = event.target as HTMLInputElement;
    const regex = /[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ\s\.,;:!\?\-\(\)]/g;
    this.receta = input.value.replace(regex, '');
  }
}
