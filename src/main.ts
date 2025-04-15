import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
  provideHttpClient(withFetch()),
  provideHttpClient(withInterceptorsFromDi()) // ✅ nueva forma recomendada

    // provideHttpClient(withFetch()) // <-- Agrega esta línea
  ]
}).catch(err => console.error(err));
