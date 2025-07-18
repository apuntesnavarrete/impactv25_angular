import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TournamentsApiService } from '../../../../service/peticiones/torneos/torneos.service';
import { EquiposApiService } from '../../../../service/peticiones/teams/teams.service';
import { PartidotorneoService } from '../../../../service/peticiones/partidos/partidotorneo.service';

@Component({
  selector: 'app-addpartido',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,],
  templateUrl: './addpartido.component.html',
  styleUrls: ['./addpartido.component.css'] // ✅ corregido aquí
})
export class AddpartidoComponent implements OnInit {
  form!: FormGroup;
  liga?: string;
  categoria?: string;
  idTorneo: number | null = null;
teams: any[] = []; // se llena con los equipos del torneo
matchGuardado: any = null;

constructor(
  private fb: FormBuilder,
  private route: ActivatedRoute,
  private tournamentService: TournamentsApiService,
  private equiposService: EquiposApiService,
  private partidoService: PartidotorneoService // ✅ servicio para crear el partido
) {}

  ngOnInit(): void {
    this.liga = this.route.snapshot.paramMap.get('liga') ?? undefined;
    this.categoria = this.route.snapshot.paramMap.get('Categoria') ?? undefined;

    this.form = this.fb.group({
  teamHome: [null],
  teamAway: [null],
  date: [null],
  matchday: [1], // ✅ lo agregas aquí, puedes iniciar en 1 o dejarlo vacío
  localgoals: [null],
  visitangoals: [null],
  ganadorDesempate: [null]
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
}
    }
  },
  error: (error) => console.error('Error cargando torneos:', error)
});
    }
  }

  onSubmit(): void {
    const formValue = this.form.value;
    const golesLocal = formValue.localgoals;
    const golesVisitante = formValue.visitangoals;

    let puntosLocal = 0;
    let puntosVisitante = 0;

    if (golesLocal > golesVisitante) {
      puntosLocal = 3;
    } else if (golesVisitante > golesLocal) {
      puntosVisitante = 3;
    } else {
      // Empate
      if (formValue.ganadorDesempate === 'local') {
        puntosLocal = 2;
        puntosVisitante = 1;
      } else if (formValue.ganadorDesempate === 'visitante') {
        puntosVisitante = 2;
        puntosLocal = 1;
      }
    }

  const finalData = {
  ...formValue,
  teamHome: Number(formValue.teamHome),
  teamAway: Number(formValue.teamAway),
  tournaments: this.idTorneo, // ya es número
  pointsLocal: puntosLocal,
  pointsVisitan: puntosVisitante
};

    console.log(finalData)

this.partidoService.createMatch(finalData).subscribe({
  next: (res) => {
    this.matchGuardado = res;

    // Puedes limpiar el formulario si quieres:
    this.form.reset({ matchday: 1 });

  },
  error: (err) => {
    console.error('Error al guardar el partido:', err);
  }
});  }

getTeamNameById(id: number | string): string {
  const team = this.teams.find(t => t.id === Number(id));
  return team ? team.name : 'Equipo no encontrado';
}
}

