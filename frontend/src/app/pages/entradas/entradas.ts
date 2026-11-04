import { Component, OnInit, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import {
  form,
  FormField,
  required,
  min,
  submit
} from '@angular/forms/signals';

import { firstValueFrom } from 'rxjs';

import {
  Producto,
  ProductoService
} from '../../services/producto';

import {
  EntradaCrear,
  EntradaService
} from '../../services/entrada';

@Component({
  selector: 'app-entradas',
  imports: [FormField],
  templateUrl: './entradas.html',
  styleUrl: './entradas.css'
})
export class Entradas implements OnInit {

  private productoService = inject(ProductoService);
  private entradaService = inject(EntradaService);

  // PRODUCTOS DISPONIBLES
  productos = signal<Producto[]>([]);
  cargandoProductos = signal(false);
  errorProductos = signal('');

  // ESTADOS DEL FORMULARIO
  guardando = signal(false);
  mensaje = signal('');
  errorRegistro = signal('');

  // MODELO DE ENTRADA
  entradaModel = signal({
    id_producto: '',
    cantidad: 1,
    motivo: '',
    numero_lote: '',
    fecha_vencimiento: ''
  });

  // VALIDACIONES
  entradaForm = form(this.entradaModel, (campo) => {

    required(campo.id_producto, {
      message: 'Selecciona un producto'
    });

    min(campo.cantidad, 1, {
      message: 'La cantidad debe ser mayor que cero'
    });

    required(campo.motivo, {
      message: 'El motivo es obligatorio'
    });

    required(campo.numero_lote, {
      message: 'El número de lote es obligatorio'
    });

    required(campo.fecha_vencimiento, {
      message: 'Selecciona la fecha de vencimiento'
    });

  });

  ngOnInit(): void {
    this.cargarProductos();
  }

  // CARGAR PRODUCTOS
  cargarProductos(): void {

    if (this.cargandoProductos()) {
      return;
    }

    this.cargandoProductos.set(true);
    this.errorProductos.set('');

    this.productoService.obtenerProductos().subscribe({

      next: (datos: Producto[]) => {

        this.productos.set(
          datos.filter(producto => producto.activo)
        );

        this.cargandoProductos.set(false);

      },

      error: (error: HttpErrorResponse) => {

        console.error(
          'Error al cargar productos:',
          error
        );

        this.errorProductos.set(
          'No se pudieron cargar los productos.'
        );

        this.cargandoProductos.set(false);

      }

    });

  }

  // REGISTRAR ENTRADA
  async onSubmit(event: Event): Promise<void> {

    event.preventDefault();

    if (this.guardando()) {
      return;
    }

    this.mensaje.set('');
    this.errorRegistro.set('');

    if (this.productos().length === 0) {

      this.errorRegistro.set(
        'No hay productos disponibles.'
      );

      return;
    }

    await submit(this.entradaForm, {

      action: async () => {

        const datos = this.entradaModel();

        const entrada: EntradaCrear = {

          id_producto: Number(datos.id_producto),

          cantidad: Number(datos.cantidad),

          motivo: datos.motivo.trim(),

          numero_lote: datos.numero_lote.trim(),

          fecha_vencimiento: datos.fecha_vencimiento

        };

        // VALIDAR PRODUCTO
        const productoExiste = this.productos().some(
          producto =>
            producto.id_producto === entrada.id_producto
        );

        if (!productoExiste) {

          this.errorRegistro.set(
            'Selecciona un producto válido.'
          );

          return;
        }

        // VALIDAR CANTIDAD
        if (
          !Number.isInteger(entrada.cantidad) ||
          entrada.cantidad <= 0
        ) {

          this.errorRegistro.set(
            'La cantidad debe ser un número entero mayor que cero.'
          );

          return;
        }

        // VALIDAR TEXTOS
        if (!entrada.motivo || !entrada.numero_lote) {

          this.errorRegistro.set(
            'Completa el motivo y el número de lote.'
          );

          return;
        }

        this.guardando.set(true);

        try {

          const respuesta = await firstValueFrom(
            this.entradaService.registrarEntrada(entrada)
          );

          this.mensaje.set(
            `Entrada registrada: ${respuesta.cantidad} unidades del lote ${respuesta.numero_lote}.`
          );

          console.log(
            'Entrada registrada:',
            respuesta
          );

          // LIMPIAR FORMULARIO
          this.entradaModel.set({
            id_producto: '',
            cantidad: 1,
            motivo: '',
            numero_lote: '',
            fecha_vencimiento: ''
          });

          // ACTUALIZAR PRODUCTOS Y STOCK
          this.cargarProductos();

        } catch (error: unknown) {

          console.error(
            'Error al registrar entrada:',
            error
          );

          if (error instanceof HttpErrorResponse) {

            if (error.status === 0) {

              this.errorRegistro.set(
                'No se pudo conectar con FastAPI.'
              );

            } else if (error.status === 422) {

              this.errorRegistro.set(
                'Los datos enviados no cumplen las validaciones.'
              );

            } else {

              const detalle = error.error?.detail;

              this.errorRegistro.set(
                typeof detalle === 'string'
                  ? detalle
                  : 'No se pudo registrar la entrada.'
              );

            }

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