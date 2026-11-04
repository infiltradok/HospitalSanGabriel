import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface LoginResponse {
  access_token: string;
  token_type: string;
  nombre: string;
  usuario: string;
  rol: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);

  private apiUrl = 'http://127.0.0.1:8000/api/auth/login';

  autenticado = signal(this.tokenVigente());

  login(usuario: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.apiUrl, {
      usuario,
      password
    });
  }

  guardarSesion(datos: LoginResponse): void {
    sessionStorage.setItem('token', datos.access_token);
    sessionStorage.setItem('nombre', datos.nombre);
    sessionStorage.setItem('rol', datos.rol);
    this.autenticado.set(true);
  }

  obtenerNombre(): string {
    return sessionStorage.getItem('nombre') || 'Administrador';
  }

  obtenerToken(): string | null {
    return sessionStorage.getItem('token');
  }

  tokenVigente(): boolean {
    const token = sessionStorage.getItem('token');

    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return typeof payload.exp === 'number'
        && payload.exp > Date.now() / 1000;
    } catch {
      return false;
    }
  }

  cerrarSesion(): void {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('nombre');
    sessionStorage.removeItem('rol');
    this.autenticado.set(false);
  }
}