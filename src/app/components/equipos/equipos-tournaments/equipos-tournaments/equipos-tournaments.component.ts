import { Component, OnInit } from '@angular/core';
import { EquiposApiService } from '../../../../service/peticiones/teams/teams.service';
import { ActivatedRoute } from '@angular/router';
import { TournamentsApiService } from '../../../../service/peticiones/torneos/torneos.service';
import { CommonModule } from '@angular/common';
import { CreateTableMainComponent } from "../../../create/create-table-main/create-table-main.component";
import { environment } from '../../../../../environments/environment';

// 👇 Importa el componente hijo si es standalone

@Component({
  selector: 'app-equipos-tournaments',
  standalone: true,
  imports: [CommonModule, CreateTableMainComponent],
  templateUrl: './equipos-tournaments.component.html',
  styleUrl: './equipos-tournaments.component.css'
})
export class EquiposTournamentsComponent implements OnInit {
  equipos: any[] = [];
  liga?: string;
  categoria?: string;
  isLoggedIn = true; // Puedes controlar esto según tus permisos o lógica

  

columns = [
  { header: 'ID', key: 'id' },
  { header: 'Nombre', key: 'name' },
  { header: 'Logo', key: 'logo', type: 'image' },
  { header: 'Fecha de Fundación', key: 'Date' },
  { header: 'Creado', key: 'createdAt' },
  { header: 'Actualizado', key: 'updatedAt' }
];
  apiruta: string = environment.baseUrlPublic;  // URL base de la API

  constructor(
    private route: ActivatedRoute,
    private tournamentService: TournamentsApiService,
    private teamsService: EquiposApiService
  ) {}

  ngOnInit() {
    this.liga = this.route.snapshot.paramMap.get('liga') ?? undefined;
    this.categoria = this.route.snapshot.paramMap.get('Categoria') ?? undefined;

    if (this.liga && this.categoria) {
      this.tournamentService.getTournamentsByLeagueAndCategory(this.liga, this.categoria).subscribe({
        next: (torneos) => {
          if (torneos.length > 0) {
            const torneoMasReciente = torneos.sort((a, b) => b.idName.localeCompare(a.idName))[0];
            const id = torneoMasReciente.id;

            console.log('ID del torneo más reciente:', id);

            this.teamsService.getTeamsByTournaments(id).subscribe({
              next: (equipos) => {
this.equipos = equipos.map((e: any) => ({
  id: e.teams.id,
  name: e.teams.name,
  logo: e.teams.logo,
  Date: e.teams.Date,
  createdAt: e.teams.createdAt,
  updatedAt: e.teams.updatedAt
}));
                console.log('Equipos:', this.equipos);
              },
              error: (err) => {
                console.error('Error al obtener equipos:', err);
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
