import { Injectable, inject } from '@angular/core';

import {
  HttpClient,
  HttpParams
} from '@angular/common/http';

import { Observable } from 'rxjs';


// =====================================
// MODELO: PRODUCTOS CON STOCK BAJO
// =====================================

export interface ProductoStockBajo {
  id_producto: number;
  codigo: string;
  nombre: string;
  categoria: string;
  stock_actual: number;
  stock_minimo: number;
  unidad_medida: string;
  estado_stock: string;
}


// =====================================
// MODELO: VENCIMIENTOS
// =====================================

export interface ProductoVencimiento {
  codigo: string;
  producto: string;
  numero_lote: string;
  fecha_vencimiento: string;
  stock_lote: number;
  dias_restantes: number;
  estado_vencimiento: string;
}


// =====================================
// MODELO: PRODUCTOS MÁS SOLICITADOS
// =====================================

export interface ProductoMasSolicitado {
  id_producto: number;
  codigo: string;
  nombre: string;
  total_salidas: number;
  numero_movimientos: number;
}


// =====================================
// SERVICIO DE REPORTES
// =====================================

@Injectable({
  providedIn: 'root'
})
export class ReporteService {

  private readonly http = inject(HttpClient);

  private readonly apiUrl =
    'http://127.0.0.1:8000/api/reportes';


  // 1. CONSULTAR PRODUCTOS CON STOCK BAJO

  obtenerStockBajo(): Observable<ProductoStockBajo[]> {

    return this.http.get<ProductoStockBajo[]>(
      `${this.apiUrl}/stock-bajo`
    );

  }


  // 2. CONSULTAR VENCIMIENTOS

  obtenerVencimientos(): Observable<ProductoVencimiento[]> {

    return this.http.get<ProductoVencimiento[]>(
      `${this.apiUrl}/vencimientos`
    );

  }


  // 3. CONSULTAR PRODUCTOS MÁS SOLICITADOS

  obtenerMasSolicitados(
    fechaInicio: string,
    fechaFin: string
  ): Observable<ProductoMasSolicitado[]> {

    const params = new HttpParams()
      .set('fecha_inicio', fechaInicio)
      .set('fecha_fin', fechaFin);

    return this.http.get<ProductoMasSolicitado[]>(
      `${this.apiUrl}/mas-solicitados`,
      { params }
    );

  }

}