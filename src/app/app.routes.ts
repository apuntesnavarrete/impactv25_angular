import { Routes } from '@angular/router';
import { JugadoresComponent } from './pages/jugadores/jugadores.component';
import { HomeComponent } from './pages/home/home.component';

export const routes: Routes = [
  { path: '', component: HomeComponent }, // Nueva página "Jugadores"

  { path: 'jugadores', component: JugadoresComponent }, // Nueva página "Jugadores"
];