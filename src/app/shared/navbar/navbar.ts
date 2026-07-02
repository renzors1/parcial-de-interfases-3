import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar implements OnInit {

  usuarioActivo: any = null;

  constructor(private router: Router) {}

  ngOnInit(): void {
    if (typeof localStorage !== 'undefined') {
      const usuario = localStorage.getItem('usuarioActivo');
      if (usuario) {
        this.usuarioActivo = JSON.parse(usuario);
      }
    }
  }

  cerrarSesion(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('usuarioActivo');
    }
    this.usuarioActivo = null;
    this.router.navigate(['/']);
  }

}