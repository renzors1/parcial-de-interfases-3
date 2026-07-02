import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { Navbar } from '../../shared/navbar/navbar';
import { Footer } from '../../shared/footer/footer';

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
export class Register {

  nombres: string = '';
  apellidos: string = '';
  dni: string = '';
  telefono: string = '';
  correo: string = '';
  password: string = '';
  confirmarPassword: string = '';
  terminos: boolean = false;

  constructor(private router: Router) {}

  registrarUsuario(): void {

    if (this.password !== this.confirmarPassword) {

      alert('Las contraseñas no coinciden.');
      return;

    }

    if (!this.terminos) {

      alert('Debe aceptar los términos y condiciones.');
      return;

    }

    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');

    const existe = usuarios.find((u: any) => u.correo === this.correo);

    if (existe) {

      alert('El correo ya se encuentra registrado.');
      return;

    }

    const nuevoUsuario = {

      nombres: this.nombres,
      apellidos: this.apellidos,
      dni: this.dni,
      telefono: this.telefono,
      correo: this.correo,
      password: this.password,
      rol: 'CLIENTE'

    };

    usuarios.push(nuevoUsuario);

    localStorage.setItem('usuarios', JSON.stringify(usuarios));

    alert('Usuario registrado correctamente.');

    this.router.navigate(['/login']);

  }

}