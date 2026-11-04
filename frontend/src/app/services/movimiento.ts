import { Injectable, inject } from '@angular/core';
import {
  HttpClient,
  HttpParams
} from '@angular/common/http';

import { Observable } from 'rxjs';

// MODELO DEL MOVIMIENTO
export interface Movimiento {

  id_movimiento: number;

  fecha_movimiento: string;

  tipo_movimiento: 'ENTRADA' | 'SALIDA';

  codigo_producto: string;

  producto: string;

  numero_lote: string;

  fecha_vencimiento: string | null;

  area_destino: string | null;

  cantidad: number;

  motivo: string | null;

  stock_anterior: number;

  stock_posterior: number;

}

// FILTROS
export interface MovimientoFiltros {

  id_producto?: number;

  tipo_movimiento?: 'ENTRADA' | 'SALIDA';

  id_area?: number;

  fecha_inicio?: string;

  fecha_fin?: string;

}

@Injectable({
  providedIn: 'root'
})
export class MovimientoService {

  private http = inject(HttpClient);

  private apiUrl = 'http://127.0.0.1:8000/api/movimientos';

  obtenerMovimientos(
    filtros: MovimientoFiltros = {}
  ): Observable<Movimiento[]> {

    let params = new HttpParams();

    if (filtros.id_producto !== undefined) {

      params = params.set(
        'id_producto',
        filtros.id_producto.toString()
      );

    }

    if (filtros.tipo_movimiento) {

      params = params.set(
        'tipo_movimiento',
        filtros.tipo_movimiento
      );

    }

    if (filtros.id_area !== undefined) {

      params = params.set(
        'id_area',
        filtros.id_area.toString()
      );

    }

    if (filtros.fecha_inicio) {

      params = params.set(
        'fecha_inicio',
        filtros.fecha_inicio
      );

    }

    if (filtros.fecha_fin) {

      params = params.set(
        'fecha_fin',
        filtros.fecha_fin
      );

    }

    return this.http.get<Movimiento[]>(
      this.apiUrl,
      { params }
    );

  }

}