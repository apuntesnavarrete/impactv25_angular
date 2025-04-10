// Guard para proteger rutas que requieren autenticación
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const token = localStorage.getItem('token');
  if (token) {
    return true;
  } else {
    // Redirige al login si no hay token
    window.alert('Necesitas iniciar sesión');
    return false;
  }
};

