import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PlayersStadisticsService } from '../../../../service/peticiones/playersStadistics/players-stadistics.service';
import { PartidotorneoService } from '../../../../service/peticiones/partidos/partidotorneo.service';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-verplayers-stadistics',
  templateUrl: './verplayers-stadistics.component.html',
  styleUrls: ['./verplayers-stadistics.component.css'],
    imports: [CommonModule], // 👈 aquí

})
export class VerplayersStadisticsComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private partidoTorneoService: PartidotorneoService,
    private playerStatsService: PlayersStadisticsService
  ) {}

  partidoinfo: any = null;
players: any[] = [];
jugadoresEquipoHome: any[] = [];
jugadoresEquipoAway: any[] = [];
apiruta = environment.baseUrlPublic;
logoLiga: string = 'logo.png'; // pon tu lógica si es dinámica
  liga?: string;
  torneo?: string;


ngOnInit(): void {
  const idPartido = Number(this.route.snapshot.paramMap.get('idpartido'));
    this.liga = this.route.snapshot.paramMap.get('liga') ?? undefined;


  forkJoin({
    match: this.partidoTorneoService.getMatch(idPartido), // devuelve array
    stats: this.playerStatsService.getPlayerStatsByMatchId(idPartido)
  }).subscribe({
    next: ({ match, stats }) => {
      const matchObj = Array.isArray(match) ? match[0] : match;

      const fragmento = stats[0].matches.tournaments.idName
  .split('-')[1]
  .split('_')
  .map((p: string) => p[0].toUpperCase() + p.slice(1).toLowerCase())
  .join(' ');
this.torneo = fragmento

      this.partidoinfo = matchObj;
      this.players = stats;

      this.jugadoresEquipoHome = this.players.filter(p => p.teams.id === matchObj.teamHome.id);
      this.jugadoresEquipoAway = this.players.filter(p => p.teams.id === matchObj.teamAway.id);

      console.log('🏠 Jugadores equipo local:', this.jugadoresEquipoHome);
      console.log('🚌 Jugadores equipo visitante:', this.jugadoresEquipoAway);
    },
    error: (error) => {
      console.error('❌ Error al cargar datos del partido o estadísticas', error);
    }
  });
}

}

