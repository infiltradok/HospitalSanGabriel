import { Component, OnInit, inject, signal } from '@angular/core';

import {
  form,
  FormField,
  required,
  min,
  submit
} from '@angular/forms/signals';

import { HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

import {
  Categoria,
  CategoriaService
} from '../../services/categoria';

import {
  Producto,
  ProductoCrear,
  ProductoService
} from '../../services/producto';

@Component({
  selector: 'app-productos',
  imports: [FormField],
  templateUrl: './productos.html',
  styleUrl: './productos.css'
})
export class Productos implements OnInit {

  private categoriaService = inject(CategoriaService);
  private productoService = inject(ProductoService);

  // ==========================================
  // CATEGORÍAS
  // ==========================================

  categorias = signal<Categoria[]>([]);
  cargandoCategorias = signal(false);
  errorCategorias = signal('');

  // ==========================================
  // REGISTRO DE PRODUCTOS
  // ==========================================

  mensaje = signal('');
  errorRegistro = signal('');
  guardando = signal(false);

  // ==========================================
  // LISTADO DE PRODUCTOS
  // ==========================================

  productos = signal<Producto[]>([]);
  cargandoProductos = signal(false);
  errorProductos = signal('');

  // ==========================================
  // MODELO DEL FORMULARIO
  // ==========================================

  productoModel = signal({
    codigo: '',
    nombre: '',
    descripcion: '',
    categoria_id: '',
    unidad_medida: '',
    precio_unitario: 0,
    stock_minimo: 0,
    fecha_vencimiento: ''
  });

  // ==========================================
  // VALIDACIONES
  // ==========================================

  productoForm = form(this.productoModel, (campo) => {

    required(campo.codigo, {
      message: 'El código es obligatorio'
    });

    required(campo.nombre, {
      message: 'El nombre es obligatorio'
    });

    required(campo.categoria_id, {
      message: 'Selecciona una categoría'
    });

    required(campo.unidad_medida, {
      message: 'Selecciona una unidad de medida'
    });

    min(campo.precio_unitario, 0.01, {
      message: 'El precio debe ser mayor que cero'
    });

    min(campo.stock_minimo, 0, {
      message: 'El stock mínimo no puede ser negativo'
    });

  });

  // ==========================================
  // INICIALIZACIÓN DEL COMPONENTE
  // ==========================================

  ngOnInit(): void {

    this.cargarCategorias();
    this.cargarProductos();

  }

  // ==========================================
  // CARGAR CATEGORÍAS DESDE FASTAPI
  // ==========================================

  cargarCategorias(): void {

    if (this.cargandoCategorias()) {
      return;
    }

    this.cargandoCategorias.set(true);
    this.errorCategorias.set('');
    this.categorias.set([]);

    console.log('Consultando categorías desde FastAPI...');

    this.categoriaService.obtenerCategorias().subscribe({

      next: (datos: Categoria[]) => {

        console.log('Categorías recibidas:', datos);

        if (!Array.isArray(datos)) {

          this.errorCategorias.set(
            'La API no devolvió una lista de categorías.'
          );

          this.cargandoCategorias.set(false);

          return;
        }

        const categoriasActivas = datos.filter(
          (categoria) => categoria.activo
        );

        this.categorias.set(categoriasActivas);

        if (categoriasActivas.length === 0) {

          this.errorCategorias.set(
            'No hay categorías activas disponibles.'
          );

        }

        this.cargandoCategorias.set(false);

      },

      error: (error: HttpErrorResponse) => {

        console.error('Error al cargar categorías:', error);

        if (error.status === 0) {

          this.errorCategorias.set(
            'No se pudo conectar con FastAPI.'
          );

        } else {

          this.errorCategorias.set(
            'Error al obtener categorías. HTTP: ' +
            error.status
          );

        }

        this.cargandoCategorias.set(false);

      }

    });

  }

  // ==========================================
  // CARGAR PRODUCTOS DESDE FASTAPI
  // ==========================================

  cargarProductos(): void {

    if (this.cargandoProductos()) {
      return;
    }

    this.cargandoProductos.set(true);
    this.errorProductos.set('');

    console.log('Consultando productos desde FastAPI...');

    this.productoService.obtenerProductos().subscribe({

      next: (datos: Producto[]) => {

        console.log('Productos recibidos:', datos);

        this.productos.set(datos);

        this.cargandoProductos.set(false);

      },

      error: (error: HttpErrorResponse) => {

        console.error('Error al cargar productos:', error);

        if (error.status === 0) {

          this.errorProductos.set(
            'No se pudo conectar con FastAPI.'
          );

        } else {

          this.errorProductos.set(
            'No se pudieron cargar los productos. HTTP: ' +
            error.status
          );

        }

        this.cargandoProductos.set(false);

      }

    });

  }

  // ==========================================
  // REGISTRAR PRODUCTO
  // ==========================================

  async onSubmit(event: Event): Promise<void> {

    event.preventDefault();

    if (this.guardando()) {
      return;
    }

    this.mensaje.set('');
    this.errorRegistro.set('');

    // VERIFICAR QUE EXISTAN CATEGORÍAS
    if (this.categorias().length === 0) {

      this.errorRegistro.set(
        'No hay categorías disponibles. Verifica FastAPI.'
      );

      return;
    }

    await submit(this.productoForm, {

      action: async () => {

        const datos = this.productoModel();

        // PREPARAR DATOS PARA FASTAPI
        const producto: ProductoCrear = {

          codigo: datos.codigo.trim(),

          nombre: datos.nombre.trim(),

          descripcion:
            datos.descripcion.trim() || null,

          categoria_id:
            Number(datos.categoria_id),

          unidad_medida:
            datos.unidad_medida,

          precio_unitario:
            Number(datos.precio_unitario),

          stock_minimo:
            Number(datos.stock_minimo),

          fecha_vencimiento:
            datos.fecha_vencimiento || null

        };

        // VALIDAR CATEGORÍA
        const categoriaExiste = this.categorias().some(
          (categoria) =>
            categoria.id_categoria === producto.categoria_id
        );

        if (!categoriaExiste) {

          this.errorRegistro.set(
            'Selecciona una categoría válida.'
          );

          return;
        }

        // VALIDAR CÓDIGO Y NOMBRE
        if (!producto.codigo || !producto.nombre) {

          this.errorRegistro.set(
            'Completa el código y el nombre del producto.'
          );

          return;
        }

        // VALIDAR STOCK MÍNIMO
        if (
          !Number.isInteger(producto.stock_minimo) ||
          producto.stock_minimo < 0
        ) {

          this.errorRegistro.set(
            'El stock mínimo debe ser un número entero no negativo.'
          );

          return;
        }

        this.guardando.set(true);

        console.log('Registrando producto:', producto);

        try {

          // ENVIAR PRODUCTO A FASTAPI
          const respuesta = await firstValueFrom(
            this.productoService.registrarProducto(producto)
          );

          console.log(
            'Producto registrado correctamente:',
            respuesta
          );

          // MOSTRAR MENSAJE DE ÉXITO
          this.mensaje.set(
            `Producto ${respuesta.codigo} registrado correctamente.`
          );

          // LIMPIAR FORMULARIO
          this.productoModel.set({
            codigo: '',
            nombre: '',
            descripcion: '',
            categoria_id: '',
            unidad_medida: '',
            precio_unitario: 0,
            stock_minimo: 0,
            fecha_vencimiento: ''
          });

          // ACTUALIZAR TABLA AUTOMÁTICAMENTE
          this.cargarProductos();

        } catch (error: unknown) {

          console.error('Error al registrar producto:', error);

          if (error instanceof HttpErrorResponse) {

            if (error.status === 409) {

              this.errorRegistro.set(
                'El código del producto ya existe.'
              );

            } else if (error.status === 422) {

              this.errorRegistro.set(
                'Los datos enviados no cumplen las validaciones.'
              );

            } else if (error.status === 0) {

              this.errorRegistro.set(
                'No se pudo conectar con FastAPI.'
              );

            } else {

              const detalle = error.error?.detail;

              this.errorRegistro.set(
                typeof detalle === 'string'
                  ? detalle
                  : 'No se pudo registrar el producto.'
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