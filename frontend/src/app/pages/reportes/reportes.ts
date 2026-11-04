import {
  Component,
  OnInit,
  inject,
  signal,
  computed
} from '@angular/core';

import {
  ReporteService,
  ProductoStockBajo,
  ProductoVencimiento,
  ProductoMasSolicitado
} from '../../services/reporte';


@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [],
  templateUrl: './reportes.html',
  styleUrl: './reportes.css'
})
export class Reportes implements OnInit {

  private readonly reporteService = inject(ReporteService);

  // =====================================
  // DATOS DE LOS REPORTES
  // =====================================

  productosStockBajo = signal<ProductoStockBajo[]>([]);

  productosVencimiento = signal<ProductoVencimiento[]>([]);

  productosMasSolicitados = signal<ProductoMasSolicitado[]>([]);


  // =====================================
  // ESTADOS DE CARGA
  // =====================================

  cargandoStock = signal(false);

  cargandoVencimientos = signal(false);

  cargandoSolicitados = signal(false);


  // =====================================
  // MENSAJES DE ERROR
  // =====================================

  errorStock = signal('');

  errorVencimientos = signal('');

  errorSolicitados = signal('');


  // =====================================
  // FILTROS POR FECHA
  // =====================================

  fechaInicio = signal('');

  fechaFin = signal('');


  // =====================================
  // INDICADORES
  // =====================================

  totalStockBajo = computed(
    () => this.productosStockBajo().length
  );

  totalVencimientos = computed(
    () => this.productosVencimiento().length
  );

  totalSolicitados = computed(
    () => this.productosMasSolicitados().length
  );


  // =====================================
  // INICIALIZACIÓN
  // =====================================

  ngOnInit(): void {

    this.establecerFechas();

    this.cargarStockBajo();

    this.cargarVencimientos();

    this.cargarMasSolicitados();

  }


  // =====================================
  // ESTABLECER FECHAS DEL MES ACTUAL
  // =====================================

  establecerFechas(): void {

    const hoy = new Date();

    const anio = hoy.getFullYear();

    const mes = String(
      hoy.getMonth() + 1
    ).padStart(2, '0');

    const dia = String(
      hoy.getDate()
    ).padStart(2, '0');

    this.fechaInicio.set(
      `${anio}-${mes}-01`
    );

    this.fechaFin.set(
      `${anio}-${mes}-${dia}`
    );

  }


  // =====================================
  // 1. CARGAR STOCK BAJO
  // =====================================

  cargarStockBajo(): void {

    this.cargandoStock.set(true);

    this.errorStock.set('');

    this.reporteService.obtenerStockBajo().subscribe({

      next: (datos) => {

        this.productosStockBajo.set(datos);

        this.cargandoStock.set(false);

      },

      error: (error) => {

        console.error(
          'Error al consultar stock bajo:',
          error
        );

        this.errorStock.set(
          'No se pudo cargar el reporte de stock bajo.'
        );

        this.cargandoStock.set(false);

      }

    });

  }


  // =====================================
  // 2. CARGAR VENCIMIENTOS
  // =====================================

  cargarVencimientos(): void {

    this.cargandoVencimientos.set(true);

    this.errorVencimientos.set('');

    this.reporteService.obtenerVencimientos().subscribe({

      next: (datos) => {

        this.productosVencimiento.set(datos);

        this.cargandoVencimientos.set(false);

      },

      error: (error) => {

        console.error(
          'Error al consultar vencimientos:',
          error
        );

        this.errorVencimientos.set(
          'No se pudo cargar el reporte de vencimientos.'
        );

        this.cargandoVencimientos.set(false);

      }

    });

  }


  // =====================================
  // 3. CARGAR PRODUCTOS MÁS SOLICITADOS
  // =====================================

  cargarMasSolicitados(): void {

    if (!this.fechaInicio() || !this.fechaFin()) {

      this.errorSolicitados.set(
        'Debes seleccionar ambas fechas.'
      );

      return;

    }

    if (this.fechaInicio() > this.fechaFin()) {

      this.errorSolicitados.set(
        'La fecha inicial no puede ser posterior a la fecha final.'
      );

      return;

    }

    this.cargandoSolicitados.set(true);

    this.errorSolicitados.set('');

    this.reporteService.obtenerMasSolicitados(
      this.fechaInicio(),
      this.fechaFin()
    ).subscribe({

      next: (datos) => {

        this.productosMasSolicitados.set(datos);

        this.cargandoSolicitados.set(false);

      },

      error: (error) => {

        console.error(
          'Error al consultar productos solicitados:',
          error
        );

        this.errorSolicitados.set(
          'No se pudo cargar el reporte de productos más solicitados.'
        );

        this.cargandoSolicitados.set(false);

      }

    });

  }


  // =====================================
  // ACTUALIZAR FILTROS
  // =====================================

  cambiarFechaInicio(event: Event): void {

    const input = event.target as HTMLInputElement;

    this.fechaInicio.set(input.value);

  }

  cambiarFechaFin(event: Event): void {

    const input = event.target as HTMLInputElement;

    this.fechaFin.set(input.value);

  }


  // =====================================
  // ACTUALIZAR TODOS LOS REPORTES
  // =====================================

  actualizarReportes(): void {

    this.cargarStockBajo();

    this.cargarVencimientos();

    this.cargarMasSolicitados();

  }

}