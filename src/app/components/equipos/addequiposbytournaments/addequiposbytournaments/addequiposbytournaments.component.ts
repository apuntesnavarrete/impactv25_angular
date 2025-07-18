import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TournamentsApiService } from '../../../../service/peticiones/torneos/torneos.service';
import { CommonModule } from '@angular/common';
import { EquiposApiService } from '../../../../service/peticiones/teams/teams.service';

@Component({
  selector: 'app-addequiposbytournaments',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './addequiposbytournaments.component.html',
  styleUrl: './addequiposbytournaments.component.css'
})
export class AddequiposbytournamentsComponent implements OnInit {
 form!: FormGroup;
  liga: string | undefined;
  categoria: string | undefined;
  torneoId: string | undefined;
mensaje: string = '';
hayError: boolean = false;
equipoAgregado: any = null;

    constructor(
    private route: ActivatedRoute,
    private tournamentService: TournamentsApiService,
    private fb: FormBuilder,
    private equiposService: EquiposApiService // ✅ aquí

  ) {}


 ngOnInit(): void {
  this.liga = this.route.snapshot.paramMap.get('liga') ?? undefined;
  this.categoria = this.route.snapshot.paramMap.get('Categoria') ?? undefined;

  this.form = this.fb.group({
    team: [''],
    participants: [''],
    torneoId: [''] // Inicialmente vacío
  });

  if (this.liga && this.categoria) {
    this.tournamentService.getTournamentsByLeagueAndCategory(this.liga, this.categoria).subscribe({
      next: (torneos) => {
        if (torneos.length > 0) {
          const torneoMasReciente = torneos.sort((a, b) =>
            b.idName.localeCompare(a.idName)
          )[0];
          this.torneoId = torneoMasReciente.id;

          console.log('ID del torneo más reciente:', this.torneoId);

          // ✅ ahora sí, ya que lo tienes, lo asignas al form:
          this.form.patchValue({ torneoId: this.torneoId });
        }
      }
    });
  }
}


onSubmit(): void {
  if (this.form.valid && this.torneoId) {
    const raw = this.form.value;
 const participantsId = Number(raw.participants);

    const payload = {
      teamsId: Number(raw.team),
      tournamentsId: Number(this.torneoId),
      participantsId: participantsId > 0 ? participantsId : null
    };
    

console.log(payload)
    this.equiposService.createTeamsTournament(payload).subscribe({
      next: (res) => {
        this.mensaje = '✅ Equipo agregado al torneo con éxito.';
        this.hayError = false;
        this.equipoAgregado = res; // ✅ guardar respuesta
        console.log('Equipo agregado:', res);
      },
      error: (err) => {
        this.mensaje = '❌ Error al agregar el equipo.';
        this.hayError = true;
        this.equipoAgregado = null;
        console.error('Error:', err);
      }
    });
  }
}
}
