import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TournamentsApiService } from '../../../../service/peticiones/torneos/torneos.service';
import { EquiposApiService } from '../../../../service/peticiones/teams/teams.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RostersService } from '../../../../service/peticiones/rosters/rosters.service';
import { JugadoresApiService } from '../../../../service/peticiones/jugadores-api.service';
import { JugadoresComponent } from "../../../jugadores/jugadores.component";

@Component({
  selector: 'app-addrosters',
  imports: [CommonModule, ReactiveFormsModule, JugadoresComponent],
  templateUrl: './addrosters.component.html',
  styleUrl: './addrosters.component.css'
})
export class AddrostersComponent  implements OnInit {
 liga?: string;
  categoria?: string;
  idTorneo: number | null = null;
teams: any[] = []; // se llena con los equipos del torneo
  form!: FormGroup;
rosters: any[] = [];
playerExistsMessage: string = '';
jugadorNuevoInfo: any = null; // Para mostrar los datos si no existe en rosters
searchJugador: string = '';
successMessage: string = '';
errorMessage: string = '';

  constructor(
      private fb: FormBuilder,

    private route: ActivatedRoute,
     private tournamentService: TournamentsApiService,
      private equiposService: EquiposApiService,
          private rostersService: RostersService,
                private jugadoresApiService: JugadoresApiService

){

  }

    ngOnInit(): void {
     this.liga = this.route.snapshot.paramMap.get('liga') ?? undefined;
    this.categoria = this.route.snapshot.paramMap.get('Categoria') ?? undefined;
    
 this.form = this.fb.group({
  team: [null],
  jugador: [null],
  dorsal: [null]
});

this.form.get('jugador')?.valueChanges.subscribe(jugadorId => {
  const idNum = Number(jugadorId);
  this.searchJugador = jugadorId;

  // Lógica para validar si ya existe en rosters
  const found = this.rosters.find(r => r.participants.id === idNum);
  if (found) {
    this.playerExistsMessage = `⚠️ Player already registered: ${found.participants.name} in team ${found.teams.name}`;
    this.jugadorNuevoInfo = null;
  } else {
    this.playerExistsMessage = '';
  }

  // Esperar un momento para asegurarse que el input de búsqueda exista
  setTimeout(() => {
    const inputBuscador = document.querySelector<HTMLInputElement>(
      'input[type="search"], input[name="buscar"], input[placeholder*="buscar"]'
    );
    if (inputBuscador) {
      inputBuscador.value = jugadorId;
      inputBuscador.dispatchEvent(new Event('input'));
    }
  }, 100); // puedes ajustar el tiempo si sigue fallando
});





 if (this.liga && this.categoria) {
    this.tournamentService.getTournamentsByLeagueAndCategory(this.liga, this.categoria).subscribe({
  next: (torneos: any[]) => {
    if (torneos.length > 0) {
      const torneoMasReciente = torneos.sort((a, b) => b.idName.localeCompare(a.idName))[0];
      this.idTorneo = torneoMasReciente.id;

      // ✅ obtener los equipos del torneo
     if (this.idTorneo !== null) {
  this.equiposService.getTeamsByTournaments(this.idTorneo.toString()).subscribe({
    next: (res: any[]) => {
      this.teams = res.map(t => t.teams);
    },
    error: (err) => console.error('Error al obtener equipos:', err)
  });


     this.rostersService.getRostersByIdTournament(this.idTorneo.toString()).subscribe({
                next: (rosters: any) => {
               
 this.rosters = rosters;

    // Check on jugador change
 
                },
                error: (err) => console.error('Error al obtener los rosters:', err)
              });

}



    }
  },
  error: (error) => console.error('Error cargando torneos:', error)
});
    }

    }

onSubmit(): void {
  const formData = {
    dorsal: this.form.value.dorsal,
    participants: Number(this.form.value.jugador),
    teams: Number(this.form.value.team),
    tournaments: this.idTorneo,
    typeParticipant : "Jugador"
  };

  console.log(formData);

  this.rostersService.addRoster(formData).subscribe({
    next: res => {
      console.log('Roster creado:', res);
       this.successMessage = `✅ Roster created!  
- ID: ${res.id}  
- Player ID: ${res.participants}  
- Team ID: ${res.teams}  
- Dorsal: ${res.dorsal}  
- Tournament ID: ${res.tournaments}  
- Created at: ${new Date(res.createdAt).toLocaleString()}`;
      this.errorMessage = '';
      this.form.reset();
    },
    error: err => {
      console.error('Error al crear roster:', err);
    }
  });
}



}
