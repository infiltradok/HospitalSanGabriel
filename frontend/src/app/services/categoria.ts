import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


// ==========================================
// MODELO PARA LISTAR CATEGORÍAS
// ==========================================

export interface Categoria {
  id_categoria: number;
  nombre: string;
  descripcion: string | null;
  activo: boolean;
}


// ==========================================
// MODELO PARA REGISTRAR CATEGORÍAS
// ==========================================

export interface CategoriaCrear {
  nombre: string;
  descripcion: string | null;
}


// ==========================================
// RESPUESTA DEL REGISTRO
// ==========================================

export interface CategoriaRegistroResponse {
  mensaje: string;
}


// ==========================================
// SERVICIO DE CATEGORÍAS
// ==========================================

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  private readonly http = inject(HttpClient);

  private readonly apiUrl =
    'http://127.0.0.1:8000/api/categorias';


  // CONSULTAR CATEGORÍAS

  obtenerCategorias(): Observable<Categoria[]> {

    return this.http.get<Categoria[]>(
      this.apiUrl
    );

  }


  // REGISTRAR NUEVA CATEGORÍA

  registrarCategoria(
    categoria: CategoriaCrear
  ): Observable<CategoriaRegistroResponse> {

    return this.http.post<CategoriaRegistroResponse>(
      this.apiUrl,
      categoria
    );

  }

}
