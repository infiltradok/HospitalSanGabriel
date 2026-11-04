import {
  Component,
  OnInit,
  inject,
  signal,
  computed
} from '@angular/core';

import {
  CategoriaService,
  Categoria,
  CategoriaCrear
} from '../../services/categoria';


@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [],
  templateUrl: './categorias.html',
  styleUrl: './categorias.css'
})
export class Categorias implements OnInit {

  private readonly categoriaService = inject(CategoriaService);


  // =====================================
  // LISTADO DE CATEGORÍAS
  // =====================================

  categorias = signal<Categoria[]>([]);

  cargando = signal(false);

  guardando = signal(false);


  // =====================================
  // FORMULARIO
  // =====================================

  nombre = signal('');

  descripcion = signal('');


  // =====================================
  // MENSAJES
  // =====================================

  mensajeExito = signal('');

  mensajeError = signal('');

  errorListado = signal('');


  // =====================================
  // INDICADORES
  // =====================================

  totalCategorias = computed(
    () => this.categorias().length
  );

  categoriasActivas = computed(
    () => this.categorias().filter(
      categoria => categoria.activo
    ).length
  );

  categoriasInactivas = computed(
    () => this.categorias().filter(
      categoria => !categoria.activo
    ).length
  );


  // =====================================
  // INICIALIZACIÓN
  // =====================================

  ngOnInit(): void {
    this.cargarCategorias();
  }


  // =====================================
  // CONSULTAR CATEGORÍAS
  // =====================================

  cargarCategorias(): void {

    this.cargando.set(true);

    this.errorListado.set('');

    this.categoriaService.obtenerCategorias().subscribe({

      next: (datos) => {

        this.categorias.set(datos);

        this.cargando.set(false);

      },

      error: (error) => {

        console.error(
          'Error al consultar categorías:',
          error
        );

        this.errorListado.set(
          'No se pudieron cargar las categorías.'
        );

        this.cargando.set(false);

      }

    });

  }


  // =====================================
  // ACTUALIZAR CAMPOS DEL FORMULARIO
  // =====================================

  cambiarNombre(event: Event): void {

    const input = event.target as HTMLInputElement;

    this.nombre.set(input.value);

  }

  cambiarDescripcion(event: Event): void {

    const textarea = event.target as HTMLTextAreaElement;

    this.descripcion.set(textarea.value);

  }


  // =====================================
  // REGISTRAR CATEGORÍA
  // =====================================

  registrarCategoria(): void {

    if (this.guardando()) {
      return;
    }

    this.mensajeExito.set('');

    this.mensajeError.set('');

    const nombre = this.nombre().trim();

    const descripcion = this.descripcion().trim();


    // VALIDAR NOMBRE

    if (!nombre) {

      this.mensajeError.set(
        'El nombre de la categoría es obligatorio.'
      );

      return;

    }


    // VALIDAR LONGITUD

    if (nombre.length > 100) {

      this.mensajeError.set(
        'El nombre no puede superar los 100 caracteres.'
      );

      return;

    }

    if (descripcion.length > 250) {

      this.mensajeError.set(
        'La descripción no puede superar los 250 caracteres.'
      );

      return;

    }


    // VALIDACIÓN PREVENTIVA DE DUPLICADOS

    const existe = this.categorias().some(
      categoria =>
        categoria.nombre.trim().toLowerCase() ===
        nombre.toLowerCase()
    );

    if (existe) {

      this.mensajeError.set(
        'Ya existe una categoría con ese nombre.'
      );

      return;

    }


    // PREPARAR DATOS

    const nuevaCategoria: CategoriaCrear = {
      nombre,
      descripcion: descripcion || null
    };


    // REGISTRAR EN FASTAPI

    this.guardando.set(true);

    this.categoriaService.registrarCategoria(
      nuevaCategoria
    ).subscribe({

      next: (respuesta) => {

        this.mensajeExito.set(
          respuesta.mensaje
        );

        this.nombre.set('');

        this.descripcion.set('');

        this.guardando.set(false);

        // ACTUALIZAR LISTADO

        this.cargarCategorias();

      },

      error: (error) => {

        console.error(
          'Error al registrar categoría:',
          error
        );

        this.mensajeError.set(
          typeof error.error?.detail === 'string'
            ? error.error.detail
            : 'No se pudo registrar la categoría.'
        );

        this.guardando.set(false);

      }

    });

  }


  // =====================================
  // LIMPIAR FORMULARIO
  // =====================================

  limpiarFormulario(): void {

    this.nombre.set('');

    this.descripcion.set('');

    this.mensajeError.set('');

    this.mensajeExito.set('');

  }

}