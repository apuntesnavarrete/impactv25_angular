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

sugerenciasAnteriores: string[] = [];

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


ultimaSugerencia: any[] = [];



generarSugerencia() {
  if (!this.enfrentamientos || this.enfrentamientos.length === 0) return;

  const seleccionados = Array.from(this.equiposSeleccionados);
  if (seleccionados.length < 2) return;

  const posiblesDuplas: {
    equipoA: string;
    equipoB: string;
    count: number;
    lastDate: string | null;
    prioridad: number;
  }[] = [];

  for (let i = 0; i < seleccionados.length; i++) {
    for (let j = i + 1; j < seleccionados.length; j++) {
      const equipoA = seleccionados[i];
      const equipoB = seleccionados[j];

      const grupo = this.enfrentamientos.find((g) => g.equipo === equipoA);
      const datos = grupo?.rivales.find((r) => r.rival === equipoB);

      const count = datos?.count ?? 0;
      const lastDate = datos?.lastDate ?? null;
      const lastTimestamp = lastDate ? new Date(lastDate).getTime() : 0;
      const prioridad = count * 1e10 + lastTimestamp;

      posiblesDuplas.push({ equipoA, equipoB, count, lastDate, prioridad });
    }
  }

  if (posiblesDuplas.length === 0) return;

  const maxIntentos = 10;
  let intentos = 0;
  let nuevaSugerencia: typeof this.sugerenciaDelDia = [];

  while (intentos < maxIntentos) {
    const usados = new Set<string>();
    nuevaSugerencia = [];

    const offset = Math.floor(Math.random() * posiblesDuplas.length);
    const ordenadas = [...posiblesDuplas].sort((a, b) => a.prioridad - b.prioridad);

    for (let i = 0; i < ordenadas.length; i++) {
      const index = (i + offset) % ordenadas.length;
      const dupla = ordenadas[index];

      if (!usados.has(dupla.equipoA) && !usados.has(dupla.equipoB)) {
        nuevaSugerencia.push({
          equipoA: dupla.equipoA,
          equipoB: dupla.equipoB,
          count: dupla.count,
          lastDate: dupla.lastDate,
        });
        usados.add(dupla.equipoA);
        usados.add(dupla.equipoB);
      }
    }

    const hash = JSON.stringify(nuevaSugerencia);
    if (!this.sugerenciasAnteriores.includes(hash)) {
      this.sugerenciaDelDia = nuevaSugerencia;
      this.ultimaSugerencia = nuevaSugerencia;
      this.sugerenciasAnteriores.push(hash);

      // descanso
      const usadosEquipos = new Set(nuevaSugerencia.flatMap((d) => [d.equipoA, d.equipoB]));
      const restantes = seleccionados.filter((eq) => !usadosEquipos.has(eq));
      this.equipoEnDescanso = restantes.length === 1 ? restantes[0] : null;

      return;
    }

    intentos++;
  }

  console.warn("No se pudo generar una sugerencia diferente después de varios intentos.");
}





toggleEquipo(nombre: string): void {
  if (this.equiposSeleccionados.has(nombre)) {
    this.equiposSeleccionados.delete(nombre);
  } else {
    this.equiposSeleccionados.add(nombre);
  }
}

weeksSinceLastMatch(lastDate: string | null): string {
  if (!lastDate) return 'Never';

  const last = new Date(lastDate);
  const now = new Date();

  const diffMs = now.getTime() - last.getTime(); // difference in milliseconds
  const diffWeeks = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 7));

  return diffWeeks + ' week' + (diffWeeks !== 1 ? 's' : '');
}

}
