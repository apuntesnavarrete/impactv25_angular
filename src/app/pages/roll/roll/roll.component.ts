import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TournamentsApiService } from '../../../service/peticiones/torneos/torneos.service';
import { RollService } from '../../../service/peticiones/roll/roll.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-roll',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './roll.component.html',
  styleUrls: ['./roll.component.css']
})
export class RollComponent implements OnInit {
  liga?: string;
  categoria?: string;
  idTorneo: number | null = null;
sugerenciaDelDia: {
  equipoA: string;
  equipoB: string;
  count: number;
  lastDate: string | null;
}[] = [];
equipoEnDescanso: string | null = null;
equiposSeleccionados: Set<string> = new Set();

  enfrentamientos: {
    equipo: string;
    rivales: { rival: string; count: number; lastDate: string | null }[];
  }[] = [];

  constructor(
    private route: ActivatedRoute,
    private tournamentService: TournamentsApiService,
    private rollService: RollService
  ) {}

  ngOnInit(): void {
    this.liga = this.route.snapshot.paramMap.get('liga') ?? undefined;
    this.categoria = this.route.snapshot.paramMap.get('Categoria') ?? undefined;
this.equiposSeleccionados = new Set(this.enfrentamientos.map(e => e.equipo));

    if (this.liga && this.categoria) {
      this.tournamentService.getTournamentsByLeagueAndCategory(this.liga, this.categoria).subscribe({
        next: (torneos) => {
          if (torneos.length > 0) {
            const torneoMasReciente = torneos.sort((a, b) => b.idName.localeCompare(a.idName))[0];
            this.idTorneo = torneoMasReciente.id;

            if (this.idTorneo !== null) {
             this.rollService.getRollByIdTournament(this.idTorneo).subscribe({
  next: (data) => {
    const processed: any[] = [];

    const equipos = Object.keys(data);
this.equiposSeleccionados = new Set(equipos); // todos activos por defecto

for (let equipo of equipos) {
      const rivalesData = data[equipo];
      const rivales = Object.keys(rivalesData).map((rival) => {
        return {
          rival,
          count: rivalesData[rival].count,
          lastDate: rivalesData[rival].lastDate,
        };
      });

      // Ordenar por count ascendente, luego por fecha ascendente (más lejana primero)
      rivales.sort((a, b) => {
        if (a.count !== b.count) return a.count - b.count;

        const fechaA = a.lastDate ? new Date(a.lastDate).getTime() : 0;
        const fechaB = b.lastDate ? new Date(b.lastDate).getTime() : 0;

        return fechaA - fechaB;
      });

      processed.push({
        equipo,
        rivales,
      });
    }

    this.enfrentamientos = processed;
  }
});

            }
          }
        },
        error: (err) => console.error('Error al obtener torneos:', err)
      });
    }
  }


  
 generarSugerencia() {
// Solo considerar equipos seleccionados
  const equiposActivos = new Set(this.equiposSeleccionados);
  if (equiposActivos.size < 2) return; // se necesitan al menos 2 para jugar

  if (!this.enfrentamientos || this.enfrentamientos.length === 0) return;

  const posiblesDuplas: {
    equipoA: string;
    equipoB: string;
    count: number;
    lastDate: string | null;
    prioridad: number;
  }[] = [];

  for (let grupo of this.enfrentamientos) {
    if (!equiposActivos.has(grupo.equipo)) continue;

    for (let rival of grupo.rivales) {
      if (!equiposActivos.has(rival.rival)) continue;

      if (grupo.equipo < rival.rival) {
        const lastTimestamp = rival.lastDate ? new Date(rival.lastDate).getTime() : 0;
        posiblesDuplas.push({
          equipoA: grupo.equipo,
          equipoB: rival.rival,
          count: rival.count,
          lastDate: rival.lastDate,
          prioridad: rival.count * 10000000000 + lastTimestamp,
        });
      }
    }
  }
posiblesDuplas.sort(() => Math.random() - 0.5);
  posiblesDuplas.sort((a, b) => a.prioridad - b.prioridad);

  const usados = new Set<string>();
  const sugerenciaFinal: typeof this.sugerenciaDelDia = [];

  for (const dupla of posiblesDuplas) {
    if (!usados.has(dupla.equipoA) && !usados.has(dupla.equipoB)) {
      sugerenciaFinal.push({
        equipoA: dupla.equipoA,
        equipoB: dupla.equipoB,
        count: dupla.count,
        lastDate: dupla.lastDate,
      });
      usados.add(dupla.equipoA);
      usados.add(dupla.equipoB);
    }
  }

  // Detectar si sobra un equipo
  const equiposRestantes = Array.from(equiposActivos).filter((eq) => !usados.has(eq));
  this.equipoEnDescanso = equiposRestantes.length === 1 ? equiposRestantes[0] : null;
  this.sugerenciaDelDia = sugerenciaFinal;

}

toggleEquipo(nombre: string): void {
  if (this.equiposSeleccionados.has(nombre)) {
    this.equiposSeleccionados.delete(nombre);
  } else {
    this.equiposSeleccionados.add(nombre);
  }
}
}
