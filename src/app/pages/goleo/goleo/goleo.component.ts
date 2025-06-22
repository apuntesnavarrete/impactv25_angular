import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GoleoLayerComponent } from '../../../components/goleo/goleo-layer/goleo-layer.component';
import { TournamentsApiService } from '../../../service/peticiones/torneos/torneos.service';
import { GoleadoresService } from '../../../service/peticiones/goleo/goleadores.service';
import { BtnDescargarComponent } from '../../../components/utils/btn-descargar/btn-descargar.component';

@Component({
  selector: 'app-goleo',
  standalone: true,
  imports: [GoleoLayerComponent, BtnDescargarComponent],
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
  nombreArchivo: string = 'tabla-general';

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
    this.torneo = this.categoria.charAt(0).toUpperCase() + this.categoria.slice(1);
          const fecha = new Date().toISOString().split('T')[0];

      this.nombreArchivo = `tabla-goleo-${this.liga}-${this.categoria}-${fecha}`;

      this.tournamentService.getTournamentsByLeagueAndCategory(this.liga, this.categoria).subscribe({
        next: (torneos) => {
          if (torneos.length > 0) {
            const torneoMasReciente = torneos.sort((a, b) => b.idName.localeCompare(a.idName))[0];
            const id = torneoMasReciente.id;

            console.log('ID del torneo más reciente:', id);

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
