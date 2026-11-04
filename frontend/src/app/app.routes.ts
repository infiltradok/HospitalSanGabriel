import { Routes } from '@angular/router';

import { Dashboard } from './pages/dashboard/dashboard';
import { Productos } from './pages/productos/productos';
import { Categorias } from './pages/categorias/categorias';
import { Entradas } from './pages/entradas/entradas';
import { Salidas } from './pages/salidas/salidas';
import { Historial } from './pages/historial/historial';
import { Reportes } from './pages/reportes/reportes';
import { Login } from './pages/login/login';

import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: Login },

  { path: '', component: Dashboard, canActivate: [authGuard] },
  { path: 'productos', component: Productos, canActivate: [authGuard] },
  { path: 'categorias', component: Categorias, canActivate: [authGuard] },
  { path: 'entradas', component: Entradas, canActivate: [authGuard] },
  { path: 'salidas', component: Salidas, canActivate: [authGuard] },
  { path: 'historial', component: Historial, canActivate: [authGuard] },
  { path: 'reportes', component: Reportes, canActivate: [authGuard] },

  { path: '**', redirectTo: '' }
];