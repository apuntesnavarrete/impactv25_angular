import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms'; // Necesario para [(ngModel)]
import { TournamentsApiService } from '../../../../service/peticiones/torneos/torneos.service';
import { PartidotorneoService } from '../../../../service/peticiones/partidos/partidotorneo.service';

@Component({
  selector: 'app-partidotorneo',
  standalone: true,
  imports: [CommonModule, FormsModule], // Importar FormsModule
  templateUrl: './partidotorneo.component.html',
  styleUrls: ['./partidotorneo.component.css']
})
export class PartidotorneoComponent implements OnInit {
  liga?: string;
  categoria?: string;
  idTorneo: number | null = null;
  partidos: any[] = [];
  searchTerm: string = ''; // Campo de búsqueda
equipoUno: string = '';
equipoDos: string = '';
  constructor(
    private route: ActivatedRoute,
    private tournamentService: TournamentsApiService,
    private partidoService: PartidotorneoService
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

            if (this.idTorneo !== null) {
              this.partidoService.getMatchesByTorneoId(this.idTorneo).subscribe({
                next: (data) => {
                  this.partidos = data;
                },
                error: (err) => console.error('Error al obtener partidos:', err)
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

  // Método para filtrar partidos según búsqueda
partidosFiltrados(): any[] {
  const equipo1 = this.equipoUno.toLowerCase();
  const equipo2 = this.equipoDos.toLowerCase();

  return this.partidos
    .filter(p => {
      const home = p.teamHome.name.toLowerCase();
      const away = p.teamAway.name.toLowerCase();

      if (equipo1 && equipo2) {
        // Solo enfrentamientos exactos entre 2 equipos (en cualquier orden)
        return (
          (home.includes(equipo1) && away.includes(equipo2)) ||
          (home.includes(equipo2) && away.includes(equipo1))
        );
      } else if (equipo1) {
        // Cualquier partido donde esté equipo1
        return home.includes(equipo1) || away.includes(equipo1);
      }

      return true; // si no hay filtro, muestra todos
    })
    .sort((a, b) => b.matchday - a.matchday); // ordenar por jornada
}

}


