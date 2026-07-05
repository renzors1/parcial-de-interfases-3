import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Navbar } from '../../shared/navbar/navbar';
import { Footer } from '../../shared/footer/footer';
import { MascotasService } from '../../services/mascotas.service';
import { AuthService } from '../../services/auth.service';
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
  esVeterinario: boolean = false;
  correoActivo: string = '';
  clientes: any[] = [];

  constructor(
    private fb: FormBuilder,
    private mascotasService: MascotasService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.cargarDatosUsuario();
    this.cargarMascotas();
    this.cargarClientes();
    this.inicializarFormulario();
  }

  cargarDatosUsuario(): void {
    const activo = this.authService.getUsuarioActivo();
    if (activo) {
      this.esCliente = activo.rol === 'CLIENTE';
      this.esVeterinario = activo.rol === 'VETERINARIO';
      this.correoActivo = activo.correo || '';
    }
  }

  cargarClientes(): void {
    const todos = this.authService.getUsuarios();
    this.clientes = todos.filter((u: any) => u.rol === 'CLIENTE');
  }

  inicializarFormulario(): void {
    let duenoDefecto = '';
    let telefonoDefecto = '';

    if (this.esCliente) {
      const activo = this.authService.getUsuarioActivo();
      if (activo) {
        duenoDefecto = activo.nombres ? `${activo.nombres} ${activo.apellidos}` : (activo.nombre || '');
        telefonoDefecto = activo.telefono || '';
      }
    }

    this.mascotaForm = this.fb.group({
      nombre: ['', Validators.required],
      especie: ['', Validators.required],
      raza: ['', Validators.required],
      edad: ['', [Validators.required, Validators.min(0)]],
      clienteUsuarioId: [''],
      dueno: [{ value: duenoDefecto, disabled: this.esCliente }, Validators.required],
      telefono: [{ value: telefonoDefecto, disabled: this.esCliente }, Validators.required]
    });
  }

  onClienteChange(): void {
    const id = this.mascotaForm.get('clienteUsuarioId')?.value;
    if (id === 'manual' || !id) {
      this.mascotaForm.get('dueno')?.enable();
      this.mascotaForm.get('telefono')?.enable();
      this.mascotaForm.get('dueno')?.setValue('');
      this.mascotaForm.get('telefono')?.setValue('');
    } else {
      const cliente = this.clientes.find(c => c.correo === id);
      if (cliente) {
        this.mascotaForm.get('dueno')?.setValue(cliente.nombre || `${cliente.nombres} ${cliente.apellidos}`);
        this.mascotaForm.get('telefono')?.setValue(cliente.telefono || '');
        this.mascotaForm.get('dueno')?.disable();
        this.mascotaForm.get('telefono')?.disable();
      }
    }
  }

  cargarMascotas(): void {
    const todas = this.mascotasService.getMascotas();
    if (this.esCliente) {
      this.mascotas = todas.filter(m => m.duenoEmail === this.correoActivo);
    } else {
      this.mascotas = todas;
    }
  }

  registrarMascota(): void {
    if (this.mascotaForm.invalid) {
      alert('Por favor complete todos los campos correctamente.');
      return;
    }

    const formVal = this.mascotaForm.getRawValue(); 

    let duenoEmail = '';
    if (this.esCliente) {
      duenoEmail = this.correoActivo;
    } else {
      const idSeleccionado = this.mascotaForm.get('clienteUsuarioId')?.value;
      if (idSeleccionado && idSeleccionado !== 'manual') {
        duenoEmail = idSeleccionado;
      }
    }

    const nuevaMascota: Mascota = {
      id: Date.now().toString(),
      nombre: formVal.nombre,
      especie: formVal.especie,
      raza: formVal.raza,
      edad: formVal.edad,
      dueno: formVal.dueno,
      telefono: formVal.telefono,
      duenoEmail: duenoEmail || undefined,
      fechaRegistro: new Date().toLocaleDateString()
    };

    this.mascotasService.saveMascota(nuevaMascota);
    this.cargarMascotas();
    
    const duenoPre = this.esCliente ? formVal.dueno : '';
    const telfPre = this.esCliente ? formVal.telefono : '';
    
    this.mascotaForm.reset({
      dueno: duenoPre,
      telefono: telfPre,
      clienteUsuarioId: ''
    });

    if (!this.esCliente) {
      this.mascotaForm.get('dueno')?.enable();
      this.mascotaForm.get('telefono')?.enable();
    }
  }

  eliminarMascota(id: string): void {
    if(confirm('¿Está seguro de que desea eliminar esta mascota?')) {
      this.mascotasService.deleteMascota(id);
      this.cargarMascotas();
    }
  }
}
