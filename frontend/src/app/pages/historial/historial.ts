import {
  Component,
  OnInit,
  computed,
  inject,
  signal
} from '@angular/core';

import { DatePipe, DecimalPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';

import {
  Movimiento,
  MovimientoFiltros,
  MovimientoService
} from '../../services/movimiento';

import {
  Producto,
  ProductoService
} from '../../services/producto';

@Component({
  selector: 'app-historial',
  imports: [DatePipe, DecimalPipe],
  templateUrl: './historial.html',
  styleUrl: './historial.css'
})
export class Historial implements OnInit {

  private movimientoService = inject(MovimientoService);
  private productoService = inject(ProductoService);

  movimientos = signal<Movimiento[]>([]);
  productos = signal<Producto[]>([]);

  cargando = signal(false);
  error = signal('');

  // FILTROS
  filtroProducto = signal('');
  filtroTipo = signal('');
  filtroFechaInicio = signal('');
  filtroFechaFin = signal('');

  // INDICADORES
  totalMovimientos = computed(
    () => this.movimientos().length
  );

  totalEntradas = computed(
    () => this.movimientos().filter(
      m => m.tipo_movimiento === 'ENTRADA'
    ).length
  );

  totalSalidas = computed(
    () => this.movimientos().filter(
      m => m.tipo_movimiento === 'SALIDA'
    ).length
  );

  ngOnInit(): void {

    this.cargarProductos();
    this.cargarMovimientos();

  }

  // PRODUCTOS PARA EL FILTRO
  cargarProductos(): void {

    this.productoService.obtenerProductos().subscribe({

      next: (datos: Producto[]) => {
        this.productos.set(datos);
      },

      error: (error: HttpErrorResponse) => {
        console.error('Error al cargar productos:', error);
      }

    });

  }

  // CONSULTAR HISTORIAL
  cargarMovimientos(): void {

    if (this.cargando()) {
      return;
    }

    if (
      this.filtroFechaInicio() &&
      this.filtroFechaFin() &&
      this.filtroFechaInicio() > this.filtroFechaFin()
    ) {

      this.error.set(
        'La fecha inicial no puede ser posterior a la fecha final.'
      );

      return;
    }

    this.cargando.set(true);
    this.error.set('');

    const tipo = this.filtroTipo();

    const filtros: MovimientoFiltros = {

      id_producto: this.filtroProducto()
        ? Number(this.filtroProducto())
        : undefined,

      tipo_movimiento:
        tipo === 'ENTRADA' || tipo === 'SALIDA'
          ? tipo
          : undefined,

      fecha_inicio:
        this.filtroFechaInicio() || undefined,

      fecha_fin:
        this.filtroFechaFin() || undefined

    };

    this.movimientoService.obtenerMovimientos(filtros).subscribe({

      next: (datos: Movimiento[]) => {

        this.movimientos.set(datos);

        this.cargando.set(false);

      },

      error: (error: HttpErrorResponse) => {

        console.error('Error al cargar historial:', error);

        this.error.set(
          'No se pudo consultar el historial de movimientos.'
        );

        this.cargando.set(false);

      }

    });

  }

  // CAMBIAR FILTROS
  cambiarProducto(event: Event): void {

    const select = event.target as HTMLSelectElement;

    this.filtroProducto.set(select.value);

  }

  cambiarTipo(event: Event): void {

    const select = event.target as HTMLSelectElement;

    this.filtroTipo.set(select.value);

  }

  cambiarFechaInicio(event: Event): void {

    const input = event.target as HTMLInputElement;

    this.filtroFechaInicio.set(input.value);

  }

  cambiarFechaFin(event: Event): void {

    const input = event.target as HTMLInputElement;

    this.filtroFechaFin.set(input.value);

  }

  // LIMPIAR FILTROS
  limpiarFiltros(): void {

    this.filtroProducto.set('');
    this.filtroTipo.set('');
    this.filtroFechaInicio.set('');
    this.filtroFechaFin.set('');

    this.cargarMovimientos();

  }

}