import { Component, OnInit } from '@angular/core';
import { TablaGeneralService } from '../../../service/peticiones/tablageneral/tabla-general.service';
import { CommonModule } from '@angular/common';
import { TablaGeneralLayerComponent } from '../../../components/tablageneralLayer/tablageneral-layer/tablageneral-layer.component';
import { BtnDescargarComponent } from '../../../components/utils/btn-descargar/btn-descargar.component';
import { ActivatedRoute } from '@angular/router';
import { TournamentsApiService } from '../../../service/peticiones/torneos/torneos.service';
import { MenuCategoriaComponent } from "../../../menu/menu-categoria/menu-categoria.component";
import { EquiposApiService } from '../../../service/peticiones/teams/teams.service';

@Component({
  selector: 'app-tablageneral',
  standalone: true,
  imports: [CommonModule, TablaGeneralLayerComponent, BtnDescargarComponent, MenuCategoriaComponent],
  templateUrl: './tablageneral.component.html',
  styleUrls: ['./tablageneral.component.css']
})
export class TablageneralComponent implements OnInit {
  clasificacion: any[] = [];
  idTorneo: number | null = null;
  mostrarJson: boolean = false; // 👈 nueva variable
  liga?: string;
  categoria?: string;
  nombreArchivo: string = 'tabla-general';

  constructor(
    private tablaService: TablaGeneralService,
    private tournamentService: TournamentsApiService,
    private route: ActivatedRoute,
    private equiposService: EquiposApiService
  ) {}

 toggleJson(): void {
    this.mostrarJson = !this.mostrarJson;
  }


  ngOnInit(): void {
    this.liga = this.route.snapshot.paramMap.get('liga') ?? undefined;
    this.categoria = this.route.snapshot.paramMap.get('Categoria') ?? undefined;

    if (this.liga && this.categoria) {
      const fecha = new Date().toISOString().split('T')[0];
      this.nombreArchivo = `tabla-general-${this.liga}-${this.categoria}-${fecha}`;

      this.obtenerTorneoYClasificacion(this.liga, this.categoria);
    } else {
      console.warn('Parámetros de liga o categoría no encontrados en la URL');
    }
  }

  private obtenerTorneoYClasificacion(liga: string, categoria: string): void {
    this.tournamentService.getTournamentsByLeagueAndCategory(liga, categoria).subscribe({
      next: (torneos: any) => {
        if (torneos.length > 0) {
          const torneoMasReciente = torneos.sort((a: any, b: any) =>
            b.idName.localeCompare(a.idName)
          )[0];
          const id = torneoMasReciente.id;
          this.idTorneo = id;

          this.obtenerClasificacionFiltrada(id);
        } else {
          console.warn('No se encontró torneo para:', liga, categoria);
        }
      },
      error: (err) => {
        console.error('Error al obtener torneos:', err);
      }
    });
  }

  private obtenerClasificacionFiltrada(idTorneo: number): void {
    this.tablaService.getTablaGeneralById(idTorneo).subscribe((data: any) => {
      console.log(data)
      this.equiposService.getTeamsByTournaments(String(idTorneo)).subscribe({
        next: (equipos: any) => {
          console.log(equipos)
          const idsEquiposTorneo = equipos.map((e: any) => e.teams.id);
          console.log(idsEquiposTorneo)
         this.clasificacion = data.filter((item: any) =>
  idsEquiposTorneo.includes(item.equipoId) // 👈 compara número con número
);
          console.log(this.clasificacion)
        },
        error: (err) => {
          console.warn('No se pudieron obtener los equipos del torneo:', err);
          this.clasificacion = data;
        }
      });
    });
  }
}




