import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GoleoLayerComponent } from '../../../components/goleo/goleo-layer/goleo-layer.component';
import { TournamentsApiService } from '../../../service/peticiones/torneos/torneos.service';
import { GoleadoresService } from '../../../service/peticiones/goleo/goleadores.service'; // 👈 importado aquí

@Component({
  selector: 'app-goleo',
  standalone: true,
  imports: [GoleoLayerComponent],
  templateUrl: './goleo.component.html',
  styleUrls: ['./goleo.component.css']
})
export class GoleoComponent implements OnInit {
  liga?: string;
  categoria?: string;

  torneo = 'Mixta Sabatina';
  tipoTorneo = 'Tabla de Goleo';
  infoType: 'Global' | 'torneo' = 'torneo';
  order = 'Goles';

goleadores: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private tournamentService: TournamentsApiService,
    private goleadoresService: GoleadoresService // 👈 agregado aquí
  ) {}

  ngOnInit(): void {
    this.liga = this.route.snapshot.paramMap.get('liga') ?? undefined;
    this.categoria = this.route.snapshot.paramMap.get('Categoria') ?? undefined;

    if (this.liga && this.categoria) {
      this.tournamentService.getTournamentsByLeagueAndCategory(this.liga, this.categoria).subscribe({
        next: (torneos) => {
          if (torneos.length > 0) {
            const torneoMasReciente = torneos.sort((a, b) => b.idName.localeCompare(a.idName))[0];
            const id = torneoMasReciente.id;

            console.log('ID del torneo más reciente:', id);
            this.torneo = torneoMasReciente.nombre || 'Torneo reciente';

            // 👇 Aquí llamamos al servicio de goleadores
            this.goleadoresService.getGoleadoresByTorneo(id).subscribe({
              next: (data) => {
                this.goleadores = data;
                console.log('Goleadores:', data);
              },
              error: (err) => {
                console.error('Error al obtener goleadores:', err);
              }
            });
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
}
