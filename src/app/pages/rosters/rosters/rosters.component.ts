import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RostersService } from '../../../service/peticiones/rosters/rosters.service';
import { TournamentsApiService } from '../../../service/peticiones/torneos/torneos.service';
import { GoleadoresService } from '../../../service/peticiones/goleo/goleadores.service';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../environments/environment';
import { FormsModule } from '@angular/forms';
import { BtnDescargarComponent } from "../../../components/utils/btn-descargar/btn-descargar.component";

@Component({
  selector: 'app-rosters',
  templateUrl: './rosters.component.html',
  styleUrls: ['./rosters.component.css'],
  imports: [
    CommonModule, FormsModule
    // otros módulos que uses como FormsModule o RouterModule
    ,
    BtnDescargarComponent
],
})
export class RostersComponent implements OnInit {
  liga?: string;
  categoria?: string;
  idTorneo: string | null = null;
rostersConEstadisticas: any[] = []; // para mostrarlo en la vista
apiruta = environment.baseUrlPublic;
mostrarTabla: boolean = false;
equipoSeleccionado: string = '';
filtroJugador: string = ''; // 👈 nuevo filtro
minAsistencias: number | null = null;
mostrarAutorizado: boolean = false;
  nombreArchivo: string = 'Registros';

  constructor(
    private route: ActivatedRoute,
    private rostersService: RostersService,
    private tournamentService: TournamentsApiService,
    private goleadoresService: GoleadoresService
  ) {}

  ngOnInit(): void {
    this.liga = this.route.snapshot.paramMap.get('liga') ?? undefined;
    this.categoria = this.route.snapshot.paramMap.get('Categoria') ?? undefined;

    if (this.liga && this.categoria) {
      this.tournamentService.getTournamentsByLeagueAndCategory(this.liga, this.categoria).subscribe({
        next: (torneos) => {
          if (torneos.length > 0) {
            const torneoMasReciente = torneos.sort((a, b) => b.idName.localeCompare(a.idName))[0];
            this.idTorneo = torneoMasReciente.id;
                const fecha = new Date().toISOString().split('T')[0];

            this.nombreArchivo = `Registros-${this.liga}-${this.categoria}-${fecha}`;

            if (this.idTorneo) {
              // Llamar rosters y goleadores al mismo tiempo
              this.rostersService.getRostersByIdTournament(this.idTorneo).subscribe({
                next: (rosters) => {
                  this.goleadoresService.getGoleadoresByTorneo(+this.idTorneo!).subscribe({
                    next: (goleadores) => {
                      const rostersConEstadisticas = rosters.map((roster: any) => {
                        const nombreJugador = roster.participants.name;
                        const idjugador = roster.participants.id;

                        const goleador = goleadores.find((g: any) => g.nombre === nombreJugador);

                        return {
                          id: idjugador,
                          nombre: nombreJugador,
                          dorsal: roster.dorsal,
                          equipo: roster.teams.name,
                          foto: roster.participants.Photo,

                          equipoLogo: roster.teams.logo,
                          goles: goleador ? goleador.goles : 0,
                          asistencias: goleador ? goleador.asistencias : 0
                        };
                      });
                     this.rostersConEstadisticas = rostersConEstadisticas;

                      console.log('Rosters con estadísticas:', rostersConEstadisticas);
                    },
                    error: (err) => console.error('Error al obtener goleadores:', err)
                  });
                },
                error: (err) => console.error('Error al obtener los rosters:', err)
              });
            }
          } else {
            console.warn('No se encontró torneo para:', this.liga, this.categoria);
          }
        },
        error: (err) => console.error('Error al obtener torneos:', err)
      });
    } else {
      console.warn('Faltan parámetros de liga o categoría');
    }
  }




get rostersFiltrados(): any[] {
  return this.rostersConEstadisticas.filter((item) => {
    const coincideEquipo = this.equipoSeleccionado
      ? item.equipo.toLowerCase().includes(this.equipoSeleccionado.toLowerCase())
      : true;

    const coincideJugador = this.filtroJugador
      ? item.nombre.toLowerCase().includes(this.filtroJugador.toLowerCase()) ||
        item.id.toString().includes(this.filtroJugador)
      : true;

    const cumpleAsistencias = this.minAsistencias != null
      ? item.asistencias >= this.minAsistencias
      : true;

    return coincideEquipo && coincideJugador && cumpleAsistencias;
  });
}
toggleMostrarAutorizado() {
  this.mostrarAutorizado = !this.mostrarAutorizado;
}

}

