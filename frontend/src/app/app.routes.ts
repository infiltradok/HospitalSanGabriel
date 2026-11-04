import { Routes } from '@angular/router';

import { Dashboard } from './pages/dashboard/dashboard';
import { Productos } from './pages/productos/productos';
import { Categorias } from './pages/categorias/categorias';
import { Entradas } from './pages/entradas/entradas';
import { Salidas } from './pages/salidas/salidas';
import { Historial } from './pages/historial/historial';
import { Reportes } from './pages/reportes/reportes';

export const routes: Routes = [
  { path: '', component: Dashboard },
  { path: 'productos', component: Productos },
  { path: 'categorias', component: Categorias },
  { path: 'entradas', component: Entradas },
  { path: 'salidas', component: Salidas },
  { path: 'historial', component: Historial },
  { path: 'reportes', component: Reportes },
  { path: '**', redirectTo: '' }
];
