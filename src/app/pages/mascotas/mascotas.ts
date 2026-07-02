import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Navbar } from '../../shared/navbar/navbar';
import { Footer } from '../../shared/footer/footer';
import { ClinicaService } from '../../services/clinica.service';
import { Mascota } from '../../models/clinica';
import { ResaltarProximaDirective } from '../../directives/resaltar-proxima.directive';

@Component({
  selector: 'app-mascotas',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, Navbar, Footer, ResaltarProximaDirective],
  templateUrl: './mascotas.html',
  styleUrl: './mascotas.css',
})
export class Mascotas implements OnInit {
  mascotas: Mascota[] = [];
  mascotaForm!: FormGroup;
  esCliente: boolean = false;
  correoActivo: string = '';

  constructor(
    private fb: FormBuilder,
    private clinicaService: ClinicaService
  ) {}

  ngOnInit(): void {
    this.cargarDatosUsuario();
    this.cargarMascotas();
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
    let duenoDefecto = '';
    let telefonoDefecto = '';

    if (this.esCliente && typeof localStorage !== 'undefined') {
      const activo = JSON.parse(localStorage.getItem('usuarioActivo') || '{}');
      duenoDefecto = activo.nombres ? `${activo.nombres} ${activo.apellidos}` : (activo.nombre || '');
      telefonoDefecto = activo.telefono || '';
    }

    this.mascotaForm = this.fb.group({
      nombre: ['', Validators.required],
      especie: ['', Validators.required],
      raza: ['', Validators.required],
      edad: ['', [Validators.required, Validators.min(0)]],
      dueno: [{ value: duenoDefecto, disabled: this.esCliente }, Validators.required],
      telefono: [{ value: telefonoDefecto, disabled: this.esCliente }, Validators.required]
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

  registrarMascota(): void {
    if (this.mascotaForm.invalid) {
      alert('Por favor complete todos los campos.');
      return;
    }

    const formValues = this.mascotaForm.getRawValue();

    const nuevaMascota: Mascota = {
      id: Date.now().toString(),
      nombre: formValues.nombre,
      especie: formValues.especie,
      raza: formValues.raza,
      edad: Number(formValues.edad),
      dueno: formValues.dueno,
      telefono: formValues.telefono,
      duenoEmail: this.esCliente ? this.correoActivo : '',
      fechaRegistro: new Date().toLocaleDateString()
    };

    this.clinicaService.saveMascota(nuevaMascota);
    this.cargarMascotas();
    this.mascotaForm.reset({
      nombre: '',
      especie: '',
      raza: '',
      edad: '',
      dueno: this.esCliente ? formValues.dueno : '',
      telefono: this.esCliente ? formValues.telefono : ''
    });
    alert('Mascota registrada correctamente.');
  }

  eliminarMascota(id: string): void {
    this.clinicaService.deleteMascota(id);
    this.cargarMascotas();
  }
}
