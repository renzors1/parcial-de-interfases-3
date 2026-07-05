import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { Navbar } from '../../shared/navbar/navbar';
import { Footer } from '../../shared/footer/footer';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    Navbar,
    Footer
  ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  correo: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  iniciarSesion(): void {
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!emailRegex.test(this.correo)) {
      alert('Por favor, ingrese un correo válido.');
      return;
    }

    if (this.password.length < 6) {
      alert('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    const usuario = this.authService.login(this.correo, this.password);

    if (!usuario) {
      alert('Correo o contraseña incorrectos.');
      return;
    }

    // Usar setTimeout para evitar que la UI se congele o bloquee el ChangeDetection de Angular
    setTimeout(() => {
      if (usuario.rol === 'ADMIN' || usuario.rol === 'VETERINARIO') {
        this.router.navigate(['/dashboard']);
      } else {
        this.router.navigate(['/']);
      }
    }, 10);
  }
}