import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { Navbar } from '../../shared/navbar/navbar';
import { Footer } from '../../shared/footer/footer';
import { ClinicaService } from '../../services/clinica.service';
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
    private clinicaService: ClinicaService
  ) {}

  ngOnInit(): void {
    this.veterinarios = this.clinicaService.getVeterinarios();
  }

  onRolChange(): void {
    if (this.rol !== 'VETERINARIO') {
      this.veterinarioAsociado = '';
    }
  }

  registrarUsuario(): void {

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

    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');

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

    usuarios.push(nuevoUsuario);

    localStorage.setItem('usuarios', JSON.stringify(usuarios));

    alert('Usuario registrado correctamente.');

    this.router.navigate(['/login']);

  }

}