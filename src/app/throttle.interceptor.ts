import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';

@Injectable()
export class ThrottleInterceptor implements HttpInterceptor {
  private lastPostTime = 0;

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.method === 'POST') {
      const now = Date.now();
      if (now - this.lastPostTime < 3000) {
        console.warn('Petición POST bloqueada por doble clic');
        return throwError(() => new Error('Doble clic detectado'));
      }
      this.lastPostTime = now;
    }

    return next.handle(req);
  }
}