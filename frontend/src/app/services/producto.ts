import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// DATOS PARA REGISTRAR UN PRODUCTO
export interface ProductoCrear {
  codigo: string;
  nombre: string;
  descripcion: string | null;
  categoria_id: number;
  unidad_medida: string;
  precio_unitario: number;
  stock_minimo: number;
  fecha_vencimiento: string | null;
}

// RESPUESTA AL REGISTRAR
export interface ProductoResponse {
  id_producto: number;
  codigo: string;
  nombre: string;
  categoria_id: number;
  stock_actual: number;
  mensaje: string;
}

// DATOS PARA MOSTRAR EN LA TABLA
export interface Producto {
  id_producto: number;
  codigo: string;
  nombre: string;
  descripcion: string | null;
  categoria_id: number;
  categoria: string;
  unidad_medida: string;
  precio_unitario: number;
  stock_minimo: number;
  stock_actual: number;
  fecha_vencimiento: string | null;
  activo: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  private http = inject(HttpClient);

  private apiUrl = 'http://127.0.0.1:8000/api/productos';

  // REGISTRAR PRODUCTO
  registrarProducto(
    producto: ProductoCrear
  ): Observable<ProductoResponse> {

    return this.http.post<ProductoResponse>(
      this.apiUrl,
      producto
    );
  }

  // LISTAR PRODUCTOS
  obtenerProductos(): Observable<Producto[]> {

    return this.http.get<Producto[]>(
      this.apiUrl
    );
  }

}