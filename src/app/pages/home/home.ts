import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { Navbar } from '../../shared/navbar/navbar';
import { Footer } from '../../shared/footer/footer';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    Navbar,
    Footer
  ],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {
  usuarioActivo: any = null;

  ngOnInit(): void {
    if (typeof localStorage !== 'undefined') {
      const usuario = localStorage.getItem('usuarioActivo');
      if (usuario) {
        this.usuarioActivo = JSON.parse(usuario);
      }
    }
  }

}