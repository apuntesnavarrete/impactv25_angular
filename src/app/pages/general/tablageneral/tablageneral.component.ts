import { Component, OnInit } from '@angular/core';
import { TablaGeneralService } from '../../../service/peticiones/tablageneral/tabla-general.service';
import { CommonModule } from '@angular/common';
import { TablaGeneralLayerComponent } from '../../../components/tablageneralLayer/tablageneral-layer/tablageneral-layer.component';
import { BtnDescargarComponent } from '../../../components/utils/btn-descargar/btn-descargar.component';
import { ActivatedRoute } from '@angular/router';
import { TournamentsApiService } from '../../../service/peticiones/torneos/torneos.service';
import { MenuCategoriaComponent } from "../../../menu/menu-categoria/menu-categoria.component";

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

  liga?: string;
  categoria?: string;
  nombreArchivo: string = 'tabla-general';

  constructor(
    private tablaService: TablaGeneralService,
    private tournamentService: TournamentsApiService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.liga = this.route.snapshot.paramMap.get('liga') ?? undefined;
    this.categoria = this.route.snapshot.paramMap.get('Categoria') ?? undefined;

    if (this.liga && this.categoria) {
      const fecha = new Date().toISOString().split('T')[0];
      this.nombreArchivo = `tabla-general-${this.liga}-${this.categoria}-${fecha}`;

      this.tournamentService.getTournamentsByLeagueAndCategory(this.liga, this.categoria).subscribe({
        next: (torneos) => {
          if (torneos.length > 0) {
            const torneoMasReciente = torneos.sort((a, b) => b.idName.localeCompare(a.idName))[0];
            const id = torneoMasReciente.id; // 🔒 aquí sí es number
            this.idTorneo = id;

            this.tablaService.getTablaGeneralById(id).subscribe((data: any) => {
              this.clasificacion = data;
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



