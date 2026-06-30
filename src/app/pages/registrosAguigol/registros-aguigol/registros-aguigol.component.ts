import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Necesario para los [(ngModel)]
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { RostersService } from '../../../service/peticiones/rosters/rosters.service';

interface Jugador {
  id: string;
  dorsal: string;
  nombre: string;
}

interface PartidoAguigol {
  numeroJornada: number;
  categoria: string;
  local: string;
  visitante: string;
  campo: string;
  hora: string;
  jugadoresLocal: Jugador[];
  jugadoresVisitante: Jugador[];
}

@Component({
  selector: 'app-registros-aguigol',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './registros-aguigol.component.html',
  styleUrls: ['./registros-aguigol.component.css']
})
export class RegistrosAguigolComponent implements OnInit {

  @ViewChild('jornadaAguigol', { static: false }) jornadaElement!: ElementRef;

  // Estructura completa del localStorage
  conversorRolJuegos: any = {};
  
  // Listas para llenar los selects dinámicamente
  diasDisponibles: string[] = [];
  canchasDisponibles: string[] = [];

  // Variables de los filtros de la interfaz
  diaSeleccionado: string = '';
  canchaSeleccionada: string = '';

  // Lista final que procesa el HTML
  listaPartidos: PartidoAguigol[] = [];

  // ID fijo de tu torneo actual (Modifica este número si cambia de edición)
  idTorneoActual: number = 1; 

  constructor(private rostersService: RostersService) {}

  ngOnInit() {
    this.cargarDatosDesdeLocalStorage();
  }

  cargarDatosDesdeLocalStorage() {
    const rawData = localStorage.getItem('rol_juegos_aguigol');
    if (rawData) {
      this.conversorRolJuegos = JSON.parse(rawData);
      this.diasDisponibles = Object.keys(this.conversorRolJuegos);
      
      // Seleccionar por defecto el primer día si existe
      if (this.diasDisponibles.length > 0) {
        this.diaSeleccionado = this.diasDisponibles[0];
        this.actualizarCanchasPorDia();
      }
    }
  }

  actualizarCanchasPorDia() {
    if (this.diaSeleccionado && this.conversorRolJuegos[this.diaSeleccionado]) {
      this.canchasDisponibles = Object.keys(this.conversorRolJuegos[this.diaSeleccionado]);
      
      // Seleccionar por defecto la primera cancha si existe
      if (this.canchasDisponibles.length > 0) {
        this.canchaSeleccionada = this.canchasDisponibles[0];
        this.consultarEnfrentamientosYRosters();
      } else {
        this.canchaSeleccionada = '';
        this.listaPartidos = [];
      }
    }
  }
consultarEnfrentamientosYRosters() {
  console.log('=== INICIO DE FILTRADO ===');
  console.log('Día seleccionado:', this.diaSeleccionado);
  console.log('Cancha seleccionada:', this.canchaSeleccionada);

  if (!this.diaSeleccionado || !this.canchaSeleccionada) {
    console.warn('Falta seleccionar día o cancha.');
    return;
  }

  const partidosFiltro = this.conversorRolJuegos[this.diaSeleccionado][this.canchaSeleccionada] || [];
  console.log('Partidos encontrados en localStorage para este filtro:', partidosFiltro);
  
  if (partidosFiltro.length === 0) {
    console.warn('No se encontraron partidos en el localStorage para la selección actual.');
    this.listaPartidos = [];
    return;
  }

  // Creamos las peticiones usando el "categoria_id" real del localStorage
  const peticionesRosters = partidosFiltro.map((partido: any, i: number) => {
    const idTorneoReal = partido.categoria_id; 
    
    console.log(`[Partido ${i + 1}] Preparando consultas HTTP:`, {
      Torneo_ID: idTorneoReal,
      Local: partido.local,
      Local_ID: partido.localId,
      Visitante: partido.visitante,
      Visitante_ID: partido.visitanteId
    });

    const peticionLocal = this.rostersService.getRostersByTournamentAndTeam(idTorneoReal, partido.localId)
      .pipe(
        catchError((error) => {
          console.error(`Error obteniendo roster local para ${partido.local}:`, error);
          return of([]);
        })
      );

    const peticionVisitante = this.rostersService.getRostersByTournamentAndTeam(idTorneoReal, partido.visitanteId)
      .pipe(
        catchError((error) => {
          console.error(`Error obteniendo roster visitante para ${partido.visitante}:`, error);
          return of([]);
        })
      );

    return forkJoin({ localJugadores: peticionLocal, visitanteJugadores: peticionVisitante });
  });

  console.log('Lanzando peticiones HTTP en paralelo con forkJoin...');

  forkJoin<any[]>(peticionesRosters).subscribe((resultados: any[]) => {
    console.log('=== RESPUESTA DE LA API RECIBIDA ===');
    console.log('Arreglo crudo de resultados del servidor:', resultados);

 this.listaPartidos = partidosFiltro.map((partido: any, index: number) => {
  const datosLocalServidor = resultados[index].localJugadores;
  const datosVisitanteServidor = resultados[index].visitanteJugadores;

  return {
    numeroJornada: 1, 
    categoria: partido.categoria,
    local: partido.local,
    visitante: partido.visitante,
    campo: this.canchaSeleccionada,
    hora: partido.horario,
    
    // Mapeo y ordenamiento para Local
    jugadoresLocal: datosLocalServidor.map((j: any) => {
      const id = j.participants?.id || j.id || '';
      const nombre = j.participants?.name || 'Sin nombre';
      return { id, dorsal: j.dorsal || '', nombre };
    }).sort((a: Jugador, b: Jugador) => Number(a.id) - Number(b.id)), // <-- Ordena de menor a mayor
    
    // Mapeo y ordenamiento para Visitante
    jugadoresVisitante: datosVisitanteServidor.map((j: any) => {
      const id = j.participants?.id || j.id || '';
      const nombre = j.participants?.name || 'Sin nombre';
      return { id, dorsal: j.dorsal || '', nombre };
    }).sort((a: Jugador, b: Jugador) => Number(a.id) - Number(b.id)) // <-- Ordena de menor a mayor
  };
});

    console.log('=== PROCESO TERMINADO ===');
    console.log('Lista final asignada a "listaPartidos" (Lista que lee el HTML):', this.listaPartidos);
  });
}


  obtener16Jugadores(jugadoresExistentes: Jugador[]): any[] {
    const totalCards = 16;
    const resultado = jugadoresExistentes ? [...jugadoresExistentes] : [];
    
    while (resultado.length < totalCards) {
      resultado.push({ id: '', dorsal: '', nombre: ''});
    }
    
    return resultado;
  }

  async descargarJornadaCompleta() {
    const elementoHtml = this.jornadaElement.nativeElement;
    const opciones = {
      margin:       0,
      filename:     `cedulas_${this.diaSeleccionado}_${this.canchaSeleccionada}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true },
      pagebreak:    { mode: ['css', 'legacy'], before: '.salto-de-pagina' },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'landscape' }
    } as const;

    const html2pdf = (await import('html2pdf.js')).default;
    html2pdf().from(elementoHtml).set(opciones).save();
  }
}