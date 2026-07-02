import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Navbar } from '../../shared/navbar/navbar';
import { Footer } from '../../shared/footer/footer';
import { ClinicaService } from '../../services/clinica.service';
import { Mascota, Cita } from '../../models/clinica';
import { FormatoFechaPipe } from '../../pipes/formato-fecha.pipe';
import { ResaltarProximaDirective } from '../../directives/resaltar-proxima.directive';

@Component({
  selector: 'app-citas',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, Navbar, Footer, FormatoFechaPipe, ResaltarProximaDirective],
  templateUrl: './citas.html',
  styleUrl: './citas.css',
})
export class Citas implements OnInit {
  mascotas: Mascota[] = [];
  citas: Cita[] = [];
  citaForm!: FormGroup;
  esCliente: boolean = false;
  correoActivo: string = '';

  veterinariosList: string[] = [
    'Dr. Carlos Mendoza (Medicina General)',
    'Dra. Ana Silva (Cirugía y Especialidades)',
    'Dr. Luis Ramos (Dermatología y Control)',
    'Dra. Sofía Pérez (Nutrición y Vacunas)'
  ];

  constructor(
    private fb: FormBuilder,
    private clinicaService: ClinicaService
  ) {}

  ngOnInit(): void {
    this.cargarDatosUsuario();
    this.cargarMascotas();
    this.cargarCitas();
    this.inicializarFormulario();
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

  inicializarFormulario(): void {
    this.citaForm = this.fb.group({
      mascotaId: ['', Validators.required],
      fecha: ['', Validators.required],
      hora: ['', Validators.required],
      veterinario: ['', Validators.required],
      motivo: ['', Validators.required]
    });
  }

  cargarMascotas(): void {
    const todas = this.clinicaService.getMascotas();
    if (this.esCliente) {
      this.mascotas = todas.filter(m => m.duenoEmail === this.correoActivo);
    } else {
      this.mascotas = todas;
    }
  }

  cargarCitas(): void {
    const todas = this.clinicaService.getCitas();
    if (this.esCliente) {
      const misMascotasIds = this.mascotas.map(m => m.id);
      this.citas = todas.filter(c => misMascotasIds.includes(c.mascotaId));
    } else {
      this.citas = todas;
    }
  }

  registrarCita(): void {
    if (this.citaForm.invalid) {
      alert('Por favor complete todos los campos.');
      return;
    }

    const mascotaSeleccionada = this.mascotas.find(m => m.id === this.citaForm.value.mascotaId);
    if (!mascotaSeleccionada) {
      alert('Mascota no válida.');
      return;
    }

    const nuevaCita: Cita = {
      id: Date.now().toString(),
      mascotaId: this.citaForm.value.mascotaId,
      mascotaNombre: mascotaSeleccionada.nombre,
      duenoNombre: mascotaSeleccionada.dueno,
      fecha: this.citaForm.value.fecha,
      hora: this.citaForm.value.hora,
      veterinario: this.citaForm.value.veterinario,
      motivo: this.citaForm.value.motivo,
      estado: 'Pendiente'
    };

    this.clinicaService.saveCita(nuevaCita);
    this.cargarCitas();
    this.citaForm.reset({ mascotaId: '', veterinario: '' });
    alert('Cita agendada correctamente.');
  }

  eliminarCita(id: string): void {
    this.clinicaService.deleteCita(id);
    this.cargarCitas();
  }
}
