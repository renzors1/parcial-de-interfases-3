import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { Navbar } from '../../shared/navbar/navbar';
import { Footer } from '../../shared/footer/footer';
import { USUARIOS_INICIALES } from '../../data/usuarios';

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

  constructor(private router: Router) {
    if (typeof localStorage !== 'undefined') {
      let usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
      
      USUARIOS_INICIALES.forEach(usuarioPrueba => {
        const existe = usuarios.some((u: any) => u.correo === usuarioPrueba.correo);
        if (!existe) {
          usuarios.push(usuarioPrueba);
        }
      });
      
      localStorage.setItem('usuarios', JSON.stringify(usuarios));
    }
  }

  iniciarSesion(): void {
    if (typeof localStorage === 'undefined') return;

    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    const usuario = usuarios.find((u: any) =>
      u.correo === this.correo &&
      u.password === this.password
    );

    if (!usuario) {
      alert('Correo o contraseña incorrectos.');
      return;
    }

    localStorage.setItem('usuarioActivo', JSON.stringify(usuario));
    alert('Bienvenido ' + (usuario.nombre || usuario.nombres || 'Usuario'));

    if (usuario.rol === 'ADMIN') {
      this.router.navigate(['/dashboard']);
    } else {
      this.router.navigate(['/']);
    }
  }

}