import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const token = localStorage.getItem('token');

  if (token && !isTokenExpired(token)) {
    return true;
  } else {
    localStorage.removeItem('token');

    window.alert('Tu sesión ha expirado o no has iniciado sesión');
    return false;
  }
};

function isTokenExpired(token: string): boolean {
  try {
    const payloadBase64 = token.split('.')[1];
    const payloadJson = atob(payloadBase64);
    const payload = JSON.parse(payloadJson);

    const now = Math.floor(Date.now() / 1000);
    return payload.exp < now;
  } catch (e) {
    return true; // Si algo falla, lo tratamos como expirado
  }
}

