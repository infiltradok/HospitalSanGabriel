import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface IndicadoresInventario {
  productos_activos: number;
  productos_stock_bajo: number;
  productos_proximos_vencer: number;
  productos_vencidos: number;
  valor_inventario: number;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private readonly http = inject(HttpClient);

  private readonly apiUrl =
    'http://127.0.0.1:8000/api/dashboard';

  obtenerIndicadores(): Observable<IndicadoresInventario> {
    return this.http.get<IndicadoresInventario>(
      `${this.apiUrl}/indicadores`
    );
  }
}