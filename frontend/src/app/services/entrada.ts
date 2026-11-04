import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface EntradaCrear {
  id_producto: number;
  cantidad: number;
  motivo: string;
  numero_lote: string;
  fecha_vencimiento: string;
}

export interface EntradaResponse {
  mensaje: string;
  id_producto: number;
  cantidad: number;
  numero_lote: string;
}

@Injectable({
  providedIn: 'root'
})
export class EntradaService {

  private http = inject(HttpClient);

  private apiUrl = 'http://127.0.0.1:8000/api/entradas';

  registrarEntrada(
    entrada: EntradaCrear
  ): Observable<EntradaResponse> {

    return this.http.post<EntradaResponse>(
      this.apiUrl,
      entrada
    );
  }
}