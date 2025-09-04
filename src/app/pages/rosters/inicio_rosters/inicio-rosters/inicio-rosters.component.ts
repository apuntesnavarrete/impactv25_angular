import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { TournamentsApiService } from '../../../../service/peticiones/torneos/torneos.service';
import { EquiposApiService } from '../../../../service/peticiones/teams/teams.service';
import { RostersService } from '../../../../service/peticiones/rosters/rosters.service';

@Component({
  selector: 'app-inicio-rosters',
  templateUrl: './inicio-rosters.component.html',
  styleUrls: ['./inicio-rosters.component.css'],
  imports: [ReactiveFormsModule, CommonModule],
})
export class InicioRostersComponent implements OnInit {
  penultimateTournamentId?: number;
  latestTournamentId?: number;
  teamsList: any[] = [];
  tournamentsList: any[] = [];
  form: FormGroup;
  statusMessage: string = ''; // Mensaje de progreso

  constructor(
    private fb: FormBuilder,
    private equiposService: EquiposApiService,
    private tournamentsService: TournamentsApiService,
    private rostersService: RostersService,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      teams: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    const liga = this.route.snapshot.paramMap.get('liga') ?? undefined;
    const categoria = this.route.snapshot.paramMap.get('Categoria') ?? undefined;

    if (liga && categoria) {
      this.tournamentsService.getTournamentsByLeagueAndCategory(liga, categoria).subscribe({
        next: (tournaments) => {
          this.tournamentsList = tournaments;

          if (tournaments.length >= 2) {
            this.penultimateTournamentId = tournaments[tournaments.length - 2].id;
            this.latestTournamentId = tournaments[tournaments.length - 1].id;

            // Obtener equipos del penúltimo torneo
            this.equiposService
              .getTeamsByTournaments(this.penultimateTournamentId!.toString())
              .subscribe({
                next: (teams) => {
                  this.teamsList = teams;
                  this.addCheckboxes();
                },
                error: (err) => console.error('Error al obtener equipos:', err),
              });
          }
        },
        error: (err) => console.error('Error al obtener torneos:', err),
      });
    }
  }

  private addCheckboxes() {
    const teamsFormArray = this.form.get('teams') as FormArray;
    if (!teamsFormArray) return;

    teamsFormArray.clear();
    this.teamsList.forEach(() => teamsFormArray.push(this.fb.control(false)));
  }

  async onSubmit(): Promise<void> {
    if (!this.form.valid || !this.teamsList.length || !this.penultimateTournamentId || !this.latestTournamentId) return;

    const teamsFormArray = this.form.get('teams') as FormArray;
    const selectedTeamIds = teamsFormArray.value
      .map((checked: boolean, i: number) => (checked ? this.teamsList[i].teams.id : null))
      .filter((id: number | null) => id !== null) as number[];

    if (!selectedTeamIds.length) {
      this.statusMessage = 'No se seleccionó ningún equipo.';
      return;
    }

    const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    for (let i = 0; i < selectedTeamIds.length; i++) {
      const teamId = selectedTeamIds[i];

      // Obtener jugadores del penúltimo torneo para este equipo
      let jugadores: any[] = [];
      try {
        jugadores = await firstValueFrom(this.rostersService.getRostersByTournamentAndTeam(this.penultimateTournamentId!, teamId));
      } catch (err) {
        console.error(`Error al obtener jugadores del equipo ${teamId}:`, err);
        this.statusMessage = `Error al obtener jugadores del equipo ${teamId}.`;
        continue;
      }

   for (let j = 0; j < jugadores.length; j++) {
  const jugador = jugadores[j];
  const payload = {
    dorsal: jugador.dorsal || null,
    participants: jugador.participants,
    teams: teamId,
    tournaments: this.latestTournamentId,
    typeParticipant: jugador.typeParticipant || "Jugador"
  };

  // Mensaje de progreso
  this.statusMessage = `Registrando jugador ${j + 1} de ${jugadores.length} del equipo ${teamId} (${i + 1} de ${selectedTeamIds.length} equipos)...`;
  console.log(this.statusMessage);

  try {
    const res = await firstValueFrom(this.rostersService.addRoster(payload));
    console.log('Jugador agregado:', res);
    this.statusMessage = `Jugador ${j + 1} de ${jugadores.length} del equipo ${teamId} registrado correctamente.`;
  } catch (err) {
    console.error(`Error al registrar jugador ${jugador.participants}:`, err);
    this.statusMessage = `Error al registrar jugador ${jugador.participants}.`;
  }

  await wait(4000); // Espera 4 segundos entre cada jugador
}

    }

    this.statusMessage = 'Todos los jugadores de los equipos seleccionados fueron procesados.';
  }
}



