import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PartidotorneoService } from '../../../service/peticiones/partidos/partidotorneo.service';
import { CommonModule } from '@angular/common';
import { RostersService } from '../../../service/peticiones/rosters/rosters.service';
import { TournamentsApiService } from '../../../service/peticiones/torneos/torneos.service';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { PlayersStadisticsService } from '../../../service/peticiones/playersStadistics/players-stadistics.service';

@Component({
  selector: 'app-players-stadistics',
  imports: [CommonModule, FormsModule],
  templateUrl: './players-stadistics.component.html',
  styleUrl: './players-stadistics.component.css'
})
export class PlayersStadisticsComponent implements OnInit {
  idpartido?: string;
  idtorneo?: number; // ahora es tipo número
  matchData: any;
  teamHome: any;
  teamAway: any;
  rostersTeamHome: any[] = [];
  rostersTeamAway: any[] = [];
  liga?: string;
  categoria?: string;
  torneo = '';
formularioHomeCompletado = false;
formularioAwayCompletado = false;
manualJsonInput: string = '';  // para guardar el texto del JSON
manualJsonError: string = '';  // para mostrar errores
  constructor(
    private route: ActivatedRoute,
    private partidoService: PartidotorneoService,
    private rostersService: RostersService,
    private tournamentService: TournamentsApiService,
    private playerStatsService: PlayersStadisticsService
  ) {}

  ngOnInit(): void {
    this.idpartido = this.route.snapshot.paramMap.get('idpartido') ?? undefined;
    this.liga = this.route.snapshot.paramMap.get('liga') ?? undefined;
    this.categoria = this.route.snapshot.paramMap.get('Categoria') ?? undefined;

    if (this.liga && this.categoria) {
      this.torneo = this.categoria.charAt(0).toUpperCase() + this.categoria.slice(1);

      this.tournamentService.getTournamentsByLeagueAndCategory(this.liga, this.categoria).subscribe({
        next: (torneos) => {
          if (torneos.length > 0) {
            const torneoMasReciente = torneos.sort((a, b) => b.idName.localeCompare(a.idName))[0];
            this.idtorneo = torneoMasReciente.id;

            console.log('ID del torneo más reciente:', this.idtorneo);

            // Solo ahora que tenemos el torneo, pedimos el partido
            this.loadMatch();
          } else {
            console.warn('No se encontró torneo para:', this.liga, this.categoria);
          }
        },
        error: (err) => {
          console.error('Error al obtener torneos:', err);
        }
      });
    } else {
      console.warn('Parámetros de liga o categoría no encontrados en la URL');
    }
  }

  loadMatch() {
    if (!this.idpartido || !this.idtorneo) return;

    const id = parseInt(this.idpartido, 10);

    this.partidoService.getMatch(id).subscribe({
      next: (data) => {
        if (Array.isArray(data) && data.length > 0) {
          this.matchData = data[0];
          this.teamHome = this.matchData.teamHome;
          this.teamAway = this.matchData.teamAway;

          console.log('🏠 Team Home:', this.teamHome.id);
          console.log('🚌 Team Away:', this.teamAway.id);

          // Cargar rosters
       this.rostersService.getRostersByTournamentAndTeam(this.idtorneo!, this.teamHome.id).subscribe({
  next: (data) => {
this.rostersTeamHome = data.sort((a: { participants: { id: number; }; }, b: { participants: { id: number; }; }) => a.participants.id - b.participants.id);
    console.log('👕 Rosters Home (ordenados):', this.rostersTeamHome);
  },
  error: (err) => {
    console.error('❌ Error cargando rosters Home:', err);
  }
});

       this.rostersService.getRostersByTournamentAndTeam(this.idtorneo!, this.teamAway.id).subscribe({
  next: (data) => {
this.rostersTeamAway = data.sort((a: { participants: { id: number; }; }, b: { participants: { id: number; }; }) => a.participants.id - b.participants.id);
    console.log('👕 Rosters Away (ordenados):', this.rostersTeamAway);
  },
  error: (err) => {
    console.error('❌ Error cargando rosters Away:', err);
  }
});
        } else {
          console.warn('⚠️ El array de datos está vacío o mal formado');
        }
      },
      error: (err) => {
        console.error('Error fetching match', err);
      }
    });
  }


submitHomeForm() {
  const filteredArray = this.rostersTeamHome
    .filter(j => j.asistio)
    .map(j => ({
      annotations: Number(j.goles) || 0,
      attendance: true,
      matches: this.matchData.id,
      participants: j.participants,
      teams: j.teams
    }));

  this.playerStatsService.sendPlayerStats(filteredArray).subscribe({
    next: (res) => {
      alert(`${filteredArray.length} jugadores registrados correctamente (local).`);
      this.formularioHomeCompletado = true;
    },
    error: (err) => {
      console.error('❌ Error enviando datos:', err);
      alert('Error al registrar asistencia local');
    }
  });
}

submitAwayForm() {
  const filteredArray = this.rostersTeamAway
    .filter(j => j.asistio)
    .map(j => ({
      annotations: Number(j.goles) || 0,
      attendance: true,
      matches: this.matchData.id,
      participants: j.participants,
      teams: j.teams
    }));

  this.playerStatsService.sendPlayerStats(filteredArray).subscribe({
    next: (res) => {
      alert(`${filteredArray.length} jugadores registrados correctamente (visitante).`);
      this.formularioAwayCompletado = true;
    },
    error: (err) => {
      console.error('❌ Error enviando datos:', err);
      alert('Error al registrar asistencia visitante');
    }
  });
}

get countAsistentesHome(): number {
  return this.rostersTeamHome.filter(j => j.asistio).length;
}

get totalGolesHome(): number {
  return this.rostersTeamHome
    .filter(j => j.asistio)
    .reduce((sum, j) => sum + (Number(j.goles) || 0), 0);
}

get countAsistentesAway(): number {
  return this.rostersTeamAway.filter(j => j.asistio).length;
}

get totalGolesAway(): number {
  return this.rostersTeamAway
    .filter(j => j.asistio)
    .reduce((sum, j) => sum + (Number(j.goles) || 0), 0);
}

get golesRestantesHome(): number {
  if (!this.matchData) return 0;
  const totalForm = this.totalGolesHome;
  const matchGoals = this.matchData.localgoals || 0;
  return matchGoals - totalForm; // positive if faltan goles, negative if sobra
}

get golesRestantesAway(): number {
  if (!this.matchData) return 0;
  const totalForm = this.totalGolesAway;
  const matchGoals = this.matchData.visitangoals || 0;
  return matchGoals - totalForm;
}

sendManualJson() {
  if (!this.matchData?.id) {
    this.manualJsonError = '❌ No hay partido cargado.';
    return;
  }

  try {
    const parsed = JSON.parse(this.manualJsonInput);

    if (!Array.isArray(parsed)) {
      this.manualJsonError = 'El JSON debe ser un arreglo ([]) de objetos.';
      return;
    }

    // 🔹 Inyectar el campo "matches" en cada objeto
    const readyData = parsed.map(obj => ({
      ...obj,
      matches: this.matchData.id
    }));

    console.log('✅ Enviando datos transformados:', readyData);

    this.playerStatsService.sendPlayerStats(readyData).subscribe({
      next: () => {
        alert(`✅ ${readyData.length} registros enviados correctamente.`);
        this.manualJsonInput = '';
        this.manualJsonError = '';
      },
      error: (err) => {
        console.error('❌ Error enviando JSON manual:', err);
        this.manualJsonError = 'Error al enviar al backend.';
      }
    });
  } catch (error: any) {
    this.manualJsonError = '❌ Error parseando el JSON: ' + error.message;
  }
}

}

