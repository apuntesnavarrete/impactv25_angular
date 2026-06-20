import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms'; // Necesario para [(ngModel)]
import { TournamentsApiService } from '../../../../service/peticiones/torneos/torneos.service';
import { PartidotorneoService } from '../../../../service/peticiones/partidos/partidotorneo.service';
import { TablaGeneralService } from '../../../../service/peticiones/tablageneral/tabla-general.service';
import { GeminiService } from '../../../../service/gemini/gemini.service';
import { PlayersStadisticsService } from '../../../../service/peticiones/playersStadistics/players-stadistics.service';
// 1. IMPORTACIONES NUEVAS


@Component({
  selector: 'app-partidotorneo',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterModule], // Importar FormsModule
  templateUrl: './partidotorneo.component.html',
  styleUrls: ['./partidotorneo.component.css']
})
export class PartidotorneoComponent implements OnInit {
  liga?: string;
  categoria?: string;
  idTorneo: number | null = null;
  partidos: any[] = [];
  searchTerm: string = ''; // Campo de búsqueda
equipoUno: string = '';
equipoDos: string = '';

// Variables para la narrativa de IA
  narrativaResultado: string = '';
  iaCargandoNarrativa: boolean = false;


constructor(
    private route: ActivatedRoute,
    private tournamentService: TournamentsApiService,
    private partidoService: PartidotorneoService,
private playerStatsService: PlayersStadisticsService,

    private tablaGeneralService: TablaGeneralService,
    private geminiService: GeminiService
  ) {}

  ngOnInit(): void {
    this.liga = this.route.snapshot.paramMap.get('liga') ?? undefined;
    this.categoria = this.route.snapshot.paramMap.get('Categoria') ?? undefined;

    if (this.liga && this.categoria) {
      this.tournamentService.getTournamentsByLeagueAndCategory(this.liga, this.categoria).subscribe({
        next: (torneos) => {
          if (torneos.length > 0) {
            const torneoMasReciente = torneos.sort((a, b) => b.idName.localeCompare(a.idName))[0];
            this.idTorneo = torneoMasReciente.id;

            if (this.idTorneo !== null) {
              this.partidoService.getMatchesByTorneoId(this.idTorneo).subscribe({
                next: (data) => {
                  this.partidos = data;
                },
                error: (err) => console.error('Error al obtener partidos:', err)
              });
            }
          } else {
            console.warn('No se encontró torneo para:', this.liga, this.categoria);
          }
        },
        error: (err) => console.error('Error al obtener torneos:', err)
      });
    } else {
      console.warn('Faltan parámetros de liga o categoría');
    }
  }

  // Método para filtrar partidos según búsqueda
partidosFiltrados(): any[] {
  const equipo1 = this.equipoUno.toLowerCase();
  const equipo2 = this.equipoDos.toLowerCase();

  return this.partidos
    .filter(p => {
      const home = p.teamHome.name.toLowerCase();
      const away = p.teamAway.name.toLowerCase();

      if (equipo1 && equipo2) {
        // Solo enfrentamientos exactos entre 2 equipos (en cualquier orden)
        return (
          (home.includes(equipo1) && away.includes(equipo2)) ||
          (home.includes(equipo2) && away.includes(equipo1))
        );
      } else if (equipo1) {
        // Cualquier partido donde esté equipo1
        return home.includes(equipo1) || away.includes(equipo1);
      }

      return true; // si no hay filtro, muestra todos
    })
    .sort((a, b) => b.matchday - a.matchday); // ordenar por jornada
}

// Lógica reutilizable para extraer el historial de enfrentamientos
  obtenerHistorialEquipos(partido: any) {
    const homeId = partido.teamHome.id;
    const awayId = partido.teamAway.id;

    const resumirPartido = (p: any) => ({
      jornada: p.matchday,
      fecha: p.date,
      local: p.teamHome.name,
      visitante: p.teamAway.name,
      golesLocal: p.localgoals,
      golesVisitante: p.visitangoals,
      resultado: `${p.localgoals}-${p.visitangoals}`
    });

    return {
      historialEquipoLocal: this.partidos.filter(p => p.teamHome.id === homeId || p.teamAway.id === homeId).map(resumirPartido),
      historialEquipoVisitante: this.partidos.filter(p => p.teamHome.id === awayId || p.teamAway.id === awayId).map(resumirPartido)
    };
  }

  generarJsonEquipos(partido: any): void {
    const historial = this.obtenerHistorialEquipos(partido);
    const resultado = {
      partidoActual: {
        jornada: partido.matchday,
        fecha: partido.date,
        local: partido.teamHome.name,
        visitante: partido.teamAway.name,
        resultado: `${partido.localgoals}-${partido.visitangoals}`
      },
      ...historial
    };

    const blob = new Blob([JSON.stringify(resultado, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${partido.teamHome.name}-vs-${partido.teamAway.name}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
  }



// 3. NUEVA FUNCIÓN PARA GENERAR NARRATIVA CON IA
generarNarrativaConIA(partido: any): void {
    if (!this.idTorneo) {
      alert('No hay un ID de torneo válido disponible.');
      return;
    }

    this.iaCargandoNarrativa = true;
    this.narrativaResultado = '';

    // 1. Pedimos la tabla general
    this.tablaGeneralService.getTablaGeneralById(this.idTorneo).subscribe({
      next: (tablaGeneral: any) => {
        
        // 2. Pedimos las estadísticas de los jugadores de este partido (asistencias y goles reales)
        this.playerStatsService.getPlayerStatsByMatchId(partido.id).subscribe({
          next: async (estadisticasJugadores: any) => {
            try {
              const nombreLiga = this.liga || 'Liga de Fútbol';
              
              // Estructuramos el partido actual incluyendo las estadísticas individuales
              const partidoActual = {
                jornada: partido.matchday,
                fecha: partido.date,
                local: partido.teamHome.name,
                visitante: partido.teamAway.name,
                golesTotalLocal: partido.localgoals,
                golesTotalVisitante: partido.visitangoals,
                // Aquí viajan los jugadores que asistieron y anotaron goles
                detallesJugadoresYAnotadores: estadisticasJugadores 
              };

              const historial = this.obtenerHistorialEquipos(partido);

              // 3. Llamamos a Gemini pasándole TODO, incluyendo los anotadores reales
              const cronica = await this.geminiService.generarNarrativaPartido(
                nombreLiga,
                partidoActual,
                historial,
                tablaGeneral
              );

              this.narrativaResultado = cronica;
            } catch (error) {
              console.error('Error procesando la narrativa con Gemini:', error);
              alert('Ocurrió un error al generar la narrativa.');
            } finally {
              this.iaCargandoNarrativa = false;
            }
          },
          error: (err: any) => {
            console.error('Error al obtener estadísticas de jugadores:', err);
            alert('No se pudieron obtener los anotadores del partido.');
            this.iaCargandoNarrativa = false;
          }
        });

      },
      error: (err: any) => {
        console.error('Error al obtener la tabla general:', err);
        alert('No se pudo obtener la tabla general.');
        this.iaCargandoNarrativa = false;
      }
    });
  }

  // Función útil para que copies toda la crónica generada al portapapeles con un clic
  copiarNarrativaCompleta(): void {
    if (!this.narrativaResultado) return;
    navigator.clipboard.writeText(this.narrativaResultado).then(() => {
      alert('¡Crónica copiada al portapapeles!');
    });
  }
}


