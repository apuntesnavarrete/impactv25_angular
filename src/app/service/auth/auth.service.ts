// src/app/auth.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root' // disponible en toda la app
})
export class AuthService {

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  login(token: string) {
    localStorage.setItem('token', token);
  }


  logout(): void {
    localStorage.removeItem('token');  // Eliminar el token
  }


  getToken(): string | null {
    return localStorage.getItem('token');
  }
}

