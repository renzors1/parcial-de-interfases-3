import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { Navbar } from '../../shared/navbar/navbar';
import { Footer } from '../../shared/footer/footer';
import { AuthService } from '../../services/auth.service';
import { VeterinariosService } from '../../services/veterinarios.service';
import { Veterinario } from '../../models/clinica';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    Navbar,
    Footer
  ],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register implements OnInit {

  nombres: string = '';
  apellidos: string = '';
  dni: string = '';
  telefono: string = '';
  correo: string = '';
  password: string = '';
  confirmarPassword: string = '';
  terminos: boolean = false;

  rol: string = 'CLIENTE';
  veterinarioAsociado: string = '';
  veterinarios: Veterinario[] = [];

  constructor(
    private router: Router,
    private authService: AuthService,
    private veterinariosService: VeterinariosService
  ) {}

  ngOnInit(): void {
    this.veterinarios = this.veterinariosService.getVeterinarios().filter(v => v.activo);
  }

  onRolChange(): void {
    if (this.rol !== 'VETERINARIO') {
      this.veterinarioAsociado = '';
    }
  }

  registrarUsuario(): void {

    const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    if (!nameRegex.test(this.nombres) || !nameRegex.test(this.apellidos)) {
      alert('Los nombres y apellidos solo pueden contener letras y espacios.');
      return;
    }

    const dniRegex = /^\d{8}$/;
    if (this.dni && !dniRegex.test(this.dni)) {
      alert('El DNI debe contener exactamente 8 dígitos numéricos.');
      return;
    }

    const telRegex = /^9\d{8}$/;
    if (this.telefono && !telRegex.test(this.telefono)) {
      alert('El teléfono debe tener 9 dígitos y empezar con 9.');
      return;
    }

    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!emailRegex.test(this.correo)) {
      alert('Por favor, ingrese un correo válido.');
      return;
    }

    if (this.password.length < 6) {
      alert('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (this.password !== this.confirmarPassword) {
      alert('Las contraseñas no coinciden.');
      return;
    }

    if (!this.terminos) {
      alert('Debe aceptar los términos y condiciones.');
      return;
    }

    if (this.rol === 'VETERINARIO' && !this.veterinarioAsociado) {
      alert('Por favor seleccione el especialista al cual se asocia.');
      return;
    }

    const usuarios = this.authService.getUsuarios();

    const existe = usuarios.find((u: any) => u.correo === this.correo);

    if (existe) {
      alert('El correo ya se encuentra registrado.');
      return;
    }

    const existeTelf = usuarios.find((u: any) => u.telefono === this.telefono);

    if (existeTelf) {
      alert('El número de teléfono ya se encuentra registrado.');
      return;
    }

    const nuevoUsuario = {
      nombres: this.nombres,
      apellidos: this.apellidos,
      nombre: `${this.nombres} ${this.apellidos}`,
      dni: this.dni,
      telefono: this.telefono,
      correo: this.correo,
      password: this.password,
      rol: this.rol,
      veterinarioAsociado: this.rol === 'VETERINARIO' ? this.veterinarioAsociado : undefined
    };

    this.authService.registrarUsuario(nuevoUsuario);

    alert('Registro exitoso. Ahora puede iniciar sesión.');
    this.router.navigate(['/login']);

  }

  filtrarNombres(event: Event, campo: 'nombres' | 'apellidos'): void {
    const input = event.target as HTMLInputElement;
    const regex = /[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g;
    input.value = input.value.replace(regex, '');
    this[campo] = input.value;
  }

  filtrarDNI(event: Event): void {
    const input = event.target as HTMLInputElement;
    const regex = /[^0-9]/g;
    input.value = input.value.replace(regex, '').substring(0, 8);
    this.dni = input.value;
  }

  filtrarTelefono(event: Event): void {
    const input = event.target as HTMLInputElement;
    const regex = /[^0-9]/g;
    input.value = input.value.replace(regex, '').substring(0, 9);
    this.telefono = input.value;
  }

}