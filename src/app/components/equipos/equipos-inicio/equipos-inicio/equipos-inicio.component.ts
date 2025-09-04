import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';

import { TournamentsApiService } from '../../../../service/peticiones/torneos/torneos.service';
import { EquiposApiService } from '../../../../service/peticiones/teams/teams.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-equipos-inicio',
  templateUrl: './equipos-inicio.component.html',
  styleUrls: ['./equipos-inicio.component.css'],
  imports: [
    ReactiveFormsModule,
    CommonModule
  ],
})
export class EquiposInicioComponent implements OnInit {
  penultimateTournamentId?: number; // Para obtener equipos del torneo pasado
  latestTournamentId?: number;      // Para registrar los nuevos equipos
  teamsList: any[] = [];
  tournamentsList: any[] = [];
  form: FormGroup;
  statusMessage: string = ''; // Para mostrar el progreso al usuario

  constructor(
    private fb: FormBuilder,
    private equiposService: EquiposApiService,
    private tournamentsService: TournamentsApiService,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      teams: this.fb.array([]),
      participants: ['']
    });
  }

  ngOnInit(): void {
    const liga = this.route.snapshot.paramMap.get('liga') ?? undefined;
    const categoria = this.route.snapshot.paramMap.get('Categoria') ?? undefined;

    if (liga && categoria) {
      // Obtener torneos
      this.tournamentsService.getTournamentsByLeagueAndCategory(liga, categoria)
        .subscribe({
          next: (tournaments) => {
            this.tournamentsList = tournaments;

            if (tournaments.length >= 2) {
              // IDs de torneos
              this.penultimateTournamentId = tournaments[tournaments.length - 2].id;
              this.latestTournamentId = tournaments[tournaments.length - 1].id;

              console.log('Penúltimo torneo ID:', this.penultimateTournamentId);
              console.log('Último torneo ID:', this.latestTournamentId);

              // Traer equipos del penúltimo torneo
              this.equiposService.getTeamsByTournaments(this.penultimateTournamentId!.toString())
                .subscribe({
                  next: (teams) => {
                    console.log(teams)
                    this.teamsList = teams;
                    this.addCheckboxes();
                  },
                  error: (err) => console.error('Error al obtener equipos:', err)
                });
            }
          },
          error: (err) => console.error('Error al obtener torneos:', err)
        });
    }
  }

 private addCheckboxes() {
  const teamsFormArray = this.form.get('teams') as FormArray;
  if (!teamsFormArray) return;

  // Limpiar antes de agregar para no duplicar
  teamsFormArray.clear();

  this.teamsList.forEach(() => teamsFormArray.push(this.fb.control(false)));
}

isSubmitting = false;


async onSubmit(): Promise<void> {
    if (!this.form.valid || !this.teamsList.length || !this.latestTournamentId) return;

    const teamsFormArray = this.form.get('teams') as FormArray;
    if (!teamsFormArray) return;

    const selectedTeamIds = teamsFormArray.value
      .map((checked: boolean, i: number) => checked ? this.teamsList[i].teams.id : null)
      .filter((id: number | null) => id !== null) as number[];

    if (!selectedTeamIds.length) {
      this.statusMessage = 'No se seleccionó ningún equipo.';
      return;
    }

    const participantsId = Number(this.form.value.participants);
    const pid = participantsId > 0 ? participantsId : null;

    const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    for (let i = 0; i < selectedTeamIds.length; i++) {
      const teamId = selectedTeamIds[i];
      const payload = {
        teamsId: teamId,
        tournamentsId: this.latestTournamentId!,
        participantsId: pid
      };

      this.statusMessage = `Registrando equipo ${i + 1} de ${selectedTeamIds.length}...`;
      console.log(this.statusMessage);

      try {
        const res = await firstValueFrom(this.equiposService.createTeamsTournament(payload));
        console.log('Equipo agregado:', res);
        this.statusMessage = `Equipo ${i + 1} registrado correctamente.`;
      } catch (err) {
        console.error('Error al agregar equipo:', err);
        this.statusMessage = `Error al registrar el equipo ${i + 1}.`;
      }

      await wait(4000); // Espera 4 segundos
    }

    this.statusMessage = 'Todos los equipos fueron procesados.';
  }


}




