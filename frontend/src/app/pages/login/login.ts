import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  private auth = inject(AuthService);
  private router = inject(Router);

  usuario = '';
  password = '';

  error = signal('');
  cargando = signal(false);

  ingresar(): void {
    this.error.set('');

    if (!this.usuario.trim() || !this.password) {
      this.error.set('Completa el usuario y la contraseña.');
      return;
    }

    this.cargando.set(true);

    this.auth.login(this.usuario.trim(), this.password).subscribe({
      next: (respuesta) => {
        this.auth.guardarSesion(respuesta);
        this.cargando.set(false);
        this.router.navigateByUrl('/');
      },
      error: (err) => {
        this.cargando.set(false);

        this.error.set(
          err.status === 401
            ? 'Usuario o contraseña incorrectos.'
            : 'No se pudo conectar con el servidor.'
        );
      }
    });
  }
}