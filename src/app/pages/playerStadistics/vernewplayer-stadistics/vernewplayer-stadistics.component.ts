import { Component, OnInit } from '@angular/core';

import html2canvas from 'html2canvas';

import { ActivatedRoute } from '@angular/router';



import { forkJoin } from 'rxjs';
import { PartidotorneoService } from '../../../service/peticiones/partidos/partidotorneo.service';
import { PlayersStadisticsService } from '../../../service/peticiones/playersStadistics/players-stadistics.service';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-vernewplayer-stadistics',

  imports: [CommonModule],

  templateUrl: './vernewplayer-stadistics.component.html',

  styleUrls: ['./vernewplayer-stadistics.component.css']
})
export class VernewplayerStadisticsComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private partidoTorneoService: PartidotorneoService,
    private playerStatsService: PlayersStadisticsService
  ) {}

  partidoinfo: any = null;
apiruta = environment.baseUrlPublic;
  players: any[] = [];

  jugadoresEquipoHome: any[] = [];

  jugadoresEquipoAway: any[] = [];

  golesLocal = 0;

  golesVisitante = 0;

  categoria = '';

  jornadaTexto = '';

  fechaTexto = '';

  fontSizeJugadores = '28px';

  ngOnInit(): void {

    const idPartido = Number(
      this.route.snapshot.paramMap.get('idpartido')
    );

    this.categoria =
      this.route.snapshot.paramMap.get('Categoria') ?? '';

    forkJoin({

      match: this.partidoTorneoService.getMatch(idPartido),

      stats: this.playerStatsService.getPlayerStatsByMatchId(idPartido)

    }).subscribe({

      next: ({ match, stats }) => {

        console.log('MATCH');
        console.log(match);

        console.log('STATS');
        console.log(stats);

        const matchObj = Array.isArray(match)
          ? match[0]
          : match;

        this.partidoinfo = matchObj;

        this.players = stats;

        /* MARCADOR */

        this.golesLocal =
          matchObj.localgoals;

        this.golesVisitante =
          matchObj.visitangoals;

        console.log('GOLES LOCAL');
        console.log(this.golesLocal);

        console.log('GOLES VISITANTE');
        console.log(this.golesVisitante);

        /* JUGADORES */

        this.jugadoresEquipoHome =
          this.players.filter(
            p =>
              p.teams.id ===
              matchObj.teamHome.id
          );

        this.jugadoresEquipoAway =
          this.players.filter(
            p =>
              p.teams.id ===
              matchObj.teamAway.id
          );

        console.log('LOCAL');
        console.log(this.jugadoresEquipoHome);
      console.log(this.jugadoresEquipoHome[0]);

        console.log('VISITANTE');
        console.log(this.jugadoresEquipoAway);


        /* TAMAÑO DINÁMICO */

        const totalJugadores = Math.max(
          this.jugadoresEquipoHome.length,
          this.jugadoresEquipoAway.length
        );

        console.log('TOTAL JUGADORES');
        console.log(totalJugadores);

        if (totalJugadores >= 10) {

          this.fontSizeJugadores = '18px';

        } else if (totalJugadores >= 8) {

          this.fontSizeJugadores = '22px';

        } else if (totalJugadores >= 6) {

          this.fontSizeJugadores = '24px';

        } else {

          this.fontSizeJugadores = '28px';

        }

        console.log('FONT SIZE');
        console.log(this.fontSizeJugadores);

        /* INFO INFERIOR */

        this.jornadaTexto =
          `Jornada ${matchObj.matchday}`;

        this.fechaTexto =
          this.formatearFecha(matchObj.date);

        console.log(this.jornadaTexto);

        console.log(this.fechaTexto);

      },

      error: (error) => {

        console.error(
          '❌ Error al cargar datos',
          error
        );

      }

    });

  }

  /* FECHA */

  formatearFecha(fecha: string): string {

    const dias = [
      'Domingo',
      'Lunes',
      'Martes',
      'Miércoles',
      'Jueves',
      'Viernes',
      'Sábado'
    ];

    const meses = [
      'enero',
      'febrero',
      'marzo',
      'abril',
      'mayo',
      'junio',
      'julio',
      'agosto',
      'septiembre',
      'octubre',
      'noviembre',
      'diciembre'
    ];

    const [year, month, day] =
      fecha.split('-').map(Number);

    const date =
      new Date(year, month - 1, day);

    const diaSemana =
      dias[date.getDay()];

    const nombreMes =
      meses[date.getMonth()];

    return `${diaSemana} ${day} de ${nombreMes} del ${year}`;
  }


  getFontSize(nombre: string): string {

  if (!nombre) return '22px';

  const largo = nombre.length;

  if (largo > 30) return '16px';

  if (largo > 24) return '20px';

  if (largo > 18) return '24px';

  return '22px';
}

  /* DESCARGAR */

  descargar() {

    const element =
      document.getElementById('card');

    if (!element) return;

    html2canvas(element, {
      useCORS: true,
      scale: 4
    }).then(canvas => {

      const link =
        document.createElement('a');

      link.download =
        'resultado.png';

      link.href =
        canvas.toDataURL('image/png');

      link.click();

    });

  }

}