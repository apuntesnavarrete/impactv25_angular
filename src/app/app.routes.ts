import { Routes } from '@angular/router';
import { JugadoresComponent } from './pages/jugadores/jugadores.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginPageComponent } from './pages/auth/login-page/login-page.component';
import { NewJugadorComponent } from './components/jugador/new-jugador/new-jugador.component';
import { authGuard } from './auth.guard';
import { EditJugadorComponent } from './components/jugador/edit-jugador/edit-jugador.component';
import { EquiposComponent } from './components/equipos/equipos/equipos.component';
import { NewEquipoComponent } from './components/equipos/new-equipo/new-equipo.component';
import { EditEquipoComponent } from './components/equipos/edit-equipo/edit-equipo.component';

export const routes: Routes = [
  { path: '', component: HomeComponent }, // Nueva página "Jugadores"

  { path: 'jugadores', component: JugadoresComponent },
  {
    path: 'jugadores/NewJugador',
    component: NewJugadorComponent,
    canActivate: [authGuard],
  },
  { 
    path: 'jugadores/edit/:id', 
    component: EditJugadorComponent , 
    canActivate: [authGuard],
  },
  { path: 'equipos', component: EquiposComponent }, // Nueva página "Jugadores"
  {
    path: 'equipos/NewEquipo',
    component: NewEquipoComponent,
    canActivate: [authGuard],
  },
  { 
    path: 'equipos/edit/:id', 
    component: EditEquipoComponent , 
    canActivate: [authGuard],
  },

  { path: 'login', component: LoginPageComponent }, // Nueva página "Jugadores"
  // Nueva página "Jugadores"
];