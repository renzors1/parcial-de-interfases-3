import { Routes } from '@angular/router';

import { Home } from './pages/home/home';
import { Login } from './auth/login/login';
import { Register } from './auth/register/register';
import { Dashboard } from './pages/dashboard/dashboard';
import { Mascotas } from './pages/mascotas/mascotas';
import { Citas } from './pages/citas/citas';
import { Historial } from './pages/historial/historial';

export const routes: Routes = [

  {
    path: '',
    component: Home
  },

  {
    path: 'login',
    component: Login
  },

  {
    path: 'register',
    component: Register
  },

  {
    path: 'dashboard',
    component: Dashboard
  },

  {
    path: 'mascotas',
    component: Mascotas
  },

  {
    path: 'citas',
    component: Citas
  },

  {
    path: 'historial',
    component: Historial
  },

  {
    path: '**',
    redirectTo: ''
  }

];