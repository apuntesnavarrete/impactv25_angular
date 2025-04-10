import { Routes } from '@angular/router';
import { JugadoresComponent } from './pages/jugadores/jugadores.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginPageComponent } from './pages/auth/login-page/login-page.component';
import { NewJugadorComponent } from './components/jugador/new-jugador/new-jugador.component';
import { authGuard } from './auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent }, // Nueva página "Jugadores"

  { path: 'jugadores', component: JugadoresComponent },
  {
    path: 'jugadores/NewJugador',
    component: NewJugadorComponent,
    canActivate: [authGuard],
  },
  { path: 'login', component: LoginPageComponent }, // Nueva página "Jugadores"
  // Nueva página "Jugadores"
];