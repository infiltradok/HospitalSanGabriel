import {
  Component,
  OnInit,
  inject,
  signal
} from '@angular/core';

import { HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

import {
  form,
  FormField,
  required,
  min,
  submit
} from '@angular/forms/signals';

import {
  Producto,
  ProductoService
} from '../../services/producto';

import {
  SalidaService,
  SalidaCrear,
  AreaHospitalaria,
  LoteDisponible
} from '../../services/salida';

@Component({
  selector: 'app-salidas',
  imports: [FormField],
  templateUrl: './salidas.html',
  styleUrl: './salidas.css'
})
export class Salidas implements OnInit {

  private productoService = inject(ProductoService);
  private salidaService = inject(SalidaService);

  // PRODUCTOS
  productos = signal<Producto[]>([]);

  // ÁREAS
  areas = signal<AreaHospitalaria[]>([]);

  // LOTES
  lotes = signal<LoteDisponible[]>([]);

  // ESTADOS DE CARGA
  cargandoProductos = signal(false);
  cargandoAreas = signal(false);
  cargandoLotes = signal(false);

  // ESTADOS DEL REGISTRO
  guardando = signal(false);
  mensaje = signal('');
  errorRegistro = signal('');
  errorCarga = signal('');

  // MODELO
  salidaModel = signal({
    id_producto: '',
    id_lote: '',
    id_area: '',
    cantidad: 1,
    motivo: ''
  });

  // VALIDACIONES
  salidaForm = form(this.salidaModel, (campo) => {

    required(campo.id_producto, {
      message: 'Selecciona un producto'
    });

    required(campo.id_lote, {
      message: 'Selecciona un lote'
    });

    required(campo.id_area, {
      message: 'Selecciona un área hospitalaria'
    });

    min(campo.cantidad, 1, {
      message: 'La cantidad debe ser mayor que cero'
    });

    required(campo.motivo, {
      message: 'El motivo es obligatorio'
    });

  });

  ngOnInit(): void {

    this.cargarProductos();
    this.cargarAreas();

  }

  // ==========================================
  // CARGAR PRODUCTOS
  // ==========================================

  cargarProductos(): void {

    this.cargandoProductos.set(true);
    this.errorCarga.set('');

    this.productoService.obtenerProductos().subscribe({

      next: (datos: Producto[]) => {

        this.productos.set(
          datos.filter(producto => producto.activo)
        );

        this.cargandoProductos.set(false);

      },

      error: (error: HttpErrorResponse) => {

        console.error('Error al cargar productos:', error);

        this.errorCarga.set(
          'No se pudieron cargar los productos.'
        );

        this.cargandoProductos.set(false);

      }

    });

  }

  // ==========================================
  // CARGAR ÁREAS
  // ==========================================

  cargarAreas(): void {

    this.cargandoAreas.set(true);
    this.errorCarga.set('');

    this.salidaService.obtenerAreas().subscribe({

      next: (datos: AreaHospitalaria[]) => {

        this.areas.set(datos);

        this.cargandoAreas.set(false);

      },

      error: (error: HttpErrorResponse) => {

        console.error('Error al cargar áreas:', error);

        this.errorCarga.set(
          'No se pudieron cargar las áreas hospitalarias.'
        );

        this.cargandoAreas.set(false);

      }

    });

  }

  // ==========================================
  // SELECCIONAR PRODUCTO
  // ==========================================

  seleccionarProducto(event: Event): void {

    const select = event.target as HTMLSelectElement;

    const idProducto = Number(select.value);

    // LIMPIAR EL LOTE ANTERIOR
    this.salidaModel.update(datos => ({
      ...datos,
      id_producto: select.value,
      id_lote: ''
    }));

    this.lotes.set([]);

    if (!idProducto) {
      return;
    }

    this.cargarLotes(idProducto);

  }

  // ==========================================
  // CARGAR LOTES DEL PRODUCTO
  // ==========================================

  cargarLotes(idProducto: number): void {

    this.cargandoLotes.set(true);
    this.errorCarga.set('');

    this.salidaService.obtenerLotes(idProducto).subscribe({

      next: (datos: LoteDisponible[]) => {

        // EVITAR MOSTRAR LOTES DE UN PRODUCTO ANTERIOR
        if (
          Number(this.salidaModel().id_producto) !== idProducto
        ) {
          return;
        }

        this.lotes.set(datos);

        this.cargandoLotes.set(false);

      },

      error: (error: HttpErrorResponse) => {

        if (
          Number(this.salidaModel().id_producto) !== idProducto
        ) {
          return;
        }

        console.error('Error al cargar lotes:', error);

        this.errorCarga.set(
          'No se pudieron cargar los lotes disponibles.'
        );

        this.cargandoLotes.set(false);

      }

    });

  }

  // ==========================================
  // REGISTRAR SALIDA
  // ==========================================

  async onSubmit(event: Event): Promise<void> {

    event.preventDefault();

    if (this.guardando()) {
      return;
    }

    this.mensaje.set('');
    this.errorRegistro.set('');

    await submit(this.salidaForm, {

      action: async () => {

        const datos = this.salidaModel();

        const salida: SalidaCrear = {

          id_producto: Number(datos.id_producto),

          id_lote: Number(datos.id_lote),

          id_area: Number(datos.id_area),

          cantidad: Number(datos.cantidad),

          motivo: datos.motivo.trim()

        };

        // VALIDAR PRODUCTO
        const productoExiste = this.productos().some(
          producto =>
            producto.id_producto === salida.id_producto
        );

        if (!productoExiste) {

          this.errorRegistro.set(
            'Selecciona un producto válido.'
          );

          return;
        }

        // VALIDAR LOTE
        const lote = this.lotes().find(
          item =>
            item.id_lote === salida.id_lote &&
            item.id_producto === salida.id_producto
        );

        if (!lote) {

          this.errorRegistro.set(
            'Selecciona un lote disponible.'
          );

          return;
        }

        // VALIDAR ÁREA
        const areaExiste = this.areas().some(
          area => area.id_area === salida.id_area
        );

        if (!areaExiste) {

          this.errorRegistro.set(
            'Selecciona un área válida.'
          );

          return;
        }

        // VALIDAR CANTIDAD
        if (
          !Number.isInteger(salida.cantidad) ||
          salida.cantidad <= 0 ||
          salida.cantidad > lote.stock_lote
        ) {

          this.errorRegistro.set(
            `La cantidad debe estar entre 1 y ${lote.stock_lote}.`
          );

          return;
        }

        if (!salida.motivo) {

          this.errorRegistro.set(
            'El motivo es obligatorio.'
          );

          return;
        }

        this.guardando.set(true);

        try {

          const respuesta = await firstValueFrom(
            this.salidaService.registrarSalida(salida)
          );

          this.mensaje.set(
            `Salida registrada correctamente: ${respuesta.cantidad} unidades.`
          );

          console.log('Salida registrada:', respuesta);

          // LIMPIAR FORMULARIO
          this.salidaModel.set({
            id_producto: '',
            id_lote: '',
            id_area: '',
            cantidad: 1,
            motivo: ''
          });

          this.lotes.set([]);

          // ACTUALIZAR STOCK
          this.cargarProductos();

        } catch (error: unknown) {

          console.error('Error al registrar salida:', error);

          if (error instanceof HttpErrorResponse) {

            const detalle = error.error?.detail;

            this.errorRegistro.set(
              typeof detalle === 'string'
                ? detalle
                : 'No se pudo registrar la salida.'
            );

          } else {

            this.errorRegistro.set(
              'Ocurrió un error inesperado.'
            );

          }

        } finally {

          this.guardando.set(false);

        }

      }

    });

  }

}