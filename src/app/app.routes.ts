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
import { TorneoComponent } from './components/torneos/torneo/torneo.component';
import { NewTorneoComponent } from './components/torneos/new-torneo/new-torneo.component';
import { EditTorneoComponent } from './components/torneos/edit-torneo/edit-torneo.component';
import { LigaComponent } from './components/ligas/liga/liga.component';
import { CategoriaComponent } from './components/categorias/categoria/categoria.component';
import { MenuLigaComponent } from './menu/menu-liga/menu-liga.component';
import { MenuCategoriaComponent } from './menu/menu-categoria/menu-categoria.component';
import { TablageneralComponent } from './pages/general/tablageneral/tablageneral.component';
import { GoleoComponent } from './pages/goleo/goleo/goleo.component';
import { PartidotorneoComponent } from './pages/partidos/partidoTorneo/partidotorneo/partidotorneo.component';
import { RostersComponent } from './pages/rosters/rosters/rosters.component';

export const routes: Routes = [
  { path: '', component: HomeComponent }, // Nueva página "Jugadores"
  // Nueva página "Jugadores"

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


  { path: 'torneos', component: TorneoComponent }, // Nueva página "Jugadores"
  {
    path: 'torneos/NewTorneo',
    component: NewTorneoComponent,
    canActivate: [authGuard],
  },
  { 
    path: 'torneo/edit/:id', 
    component: EditTorneoComponent , 
    canActivate: [authGuard],
  },

  { path: 'ligas', component: LigaComponent }, // Nueva página "Jugadores"

  { path: 'categorias', component: CategoriaComponent }, // Nueva página "Jugadores"

  { path: 'login', component: LoginPageComponent }, // Nueva página "Jugadores"
  // Nueva página "Jugadores"


  { path: ':liga', component: MenuLigaComponent },
  { path: ':liga/:Categoria', component: MenuCategoriaComponent },
  { path: ':liga/:Categoria/general', component: TablageneralComponent },
  { path: ':liga/:Categoria/goleo', component: GoleoComponent },
  { path: ':liga/:Categoria/partidos', component: PartidotorneoComponent },
  { path: ':liga/:Categoria/planteles', component: RostersComponent },

];