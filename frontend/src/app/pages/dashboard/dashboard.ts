import { Component, OnInit, inject, signal } from '@angular/core';

import {
  DashboardService,
  IndicadoresInventario
} from '../../services/dashboard';

import {
  MovimientoService,
  Movimiento
} from '../../services/movimiento';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {

  private readonly dashboardService = inject(DashboardService);

  private readonly movimientoService = inject(MovimientoService);

  indicadores = signal<IndicadoresInventario>({
    productos_activos: 0,
    productos_stock_bajo: 0,
    productos_proximos_vencer: 0,
    productos_vencidos: 0,
    valor_inventario: 0
  });

  movimientosRecientes = signal<Movimiento[]>([]);

  cargando = signal(true);
  cargandoMovimientos = signal(true);

  error = signal('');
  errorMovimientos = signal('');

  ngOnInit(): void {
    this.cargarIndicadores();
    this.cargarMovimientosRecientes();
  }

  cargarIndicadores(): void {
    this.cargando.set(true);
    this.error.set('');

    this.dashboardService.obtenerIndicadores().subscribe({
      next: (datos) => {
        this.indicadores.set(datos);
        this.cargando.set(false);
      },
      error: (error) => {
        console.error('Error al cargar indicadores:', error);
        this.error.set('No se pudieron cargar los indicadores.');
        this.cargando.set(false);
      }
    });
  }

  cargarMovimientosRecientes(): void {
    this.cargandoMovimientos.set(true);
    this.errorMovimientos.set('');

    this.movimientoService.obtenerMovimientos().subscribe({
      next: (movimientos) => {
        const recientes = [...movimientos]
          .sort((a, b) =>
            new Date(b.fecha_movimiento).getTime() -
            new Date(a.fecha_movimiento).getTime()
          )
          .slice(0, 5);

        this.movimientosRecientes.set(recientes);
        this.cargandoMovimientos.set(false);
      },
      error: (error) => {
        console.error('Error al cargar movimientos:', error);
        this.errorMovimientos.set(
          'No se pudieron cargar los movimientos recientes.'
        );
        this.cargandoMovimientos.set(false);
      }
    });
  }

  formatearFecha(fecha: string): string {
    const fechaMovimiento = new Date(fecha);

    return fechaMovimiento.toLocaleString('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  }
}