import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// LOTES DISPONIBLES
export interface LoteDisponible {
  id_lote: number;
  id_producto: number;
  numero_lote: string;
  stock_lote: number;
  fecha_vencimiento: string;
}

// ÁREAS HOSPITALARIAS
export interface AreaHospitalaria {
  id_area: number;
  nombre: string;
}

// DATOS PARA REGISTRAR SALIDA
export interface SalidaCrear {
  id_producto: number;
  id_lote: number;
  id_area: number;
  cantidad: number;
  motivo: string;
}

// RESPUESTA DE FASTAPI
export interface SalidaResponse {
  mensaje: string;
  id_producto: number;
  id_lote: number;
  id_area: number;
  cantidad: number;
}

@Injectable({
  providedIn: 'root'
})
export class SalidaService {

  private http = inject(HttpClient);

  private apiUrl = 'http://127.0.0.1:8000/api/salidas';

  // OBTENER ÁREAS
  obtenerAreas(): Observable<AreaHospitalaria[]> {

    return this.http.get<AreaHospitalaria[]>(
      `${this.apiUrl}/areas`
    );
  }

  // OBTENER LOTES POR PRODUCTO
  obtenerLotes(
    idProducto: number
  ): Observable<LoteDisponible[]> {

    return this.http.get<LoteDisponible[]>(
      `${this.apiUrl}/lotes/${idProducto}`
    );
  }

  // REGISTRAR SALIDA
  registrarSalida(
    salida: SalidaCrear
  ): Observable<SalidaResponse> {

    return this.http.post<SalidaResponse>(
      this.apiUrl,
      salida
    );
  }
}