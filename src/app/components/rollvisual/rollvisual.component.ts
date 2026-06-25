import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import html2canvas from 'html2canvas';
import { BtnDescargarComponent } from '../utils/btn-descargar/btn-descargar.component';
import { FilarollComponent } from './filaroll/filaroll.component';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { EquiposApiService } from '../../service/peticiones/teams/teams.service';
import { GeminiService } from '../../service/gemini/gemini.service';
// Importamos el servicio de Gemini

@Component({
  selector: 'app-rollvisual',
  imports: [BtnDescargarComponent, FilarollComponent, FormsModule],
  templateUrl: './rollvisual.component.html',
  styleUrl: './rollvisual.component.css'
})
export class RollvisualComponent implements OnInit {

  numeroCampo: string = '1'; 
  diaSemana: string = 'LUNES';

  // Aquí guardaremos la lista oficial de equipos procesados para enviársela a Gemini
  listaOficialEquipos: any[] = [];

  // Guardará el JSON estructurado completo que regrese Gemini
  rolCompletoGemini: any = null;


  cargandoGemini: boolean = false;



  // Lista de partidos activa que se renderiza en el póster
  listaPartidos: any[] = [
    {
      "categoria": "sub 16",
      "local": "Juventus",
      "localLogo": "juventus.png",
      "visitante": "Arsenal",
      "visitanteLogo": "arsenal.png",
      "horario": "7:20pm"
    }
  ];

  jsonTexto: string = JSON.stringify(this.listaPartidos, null, 2);


  @ViewChild('poster', { static: false }) posterElement!: ElementRef;

  // Inyectamos el GeminiService en el constructor
  constructor(
    private equiposService: EquiposApiService,
    private geminiService: GeminiService
  ) {}

ngOnInit(): void {
    this.obtenerEImprimirEquipos();
    // Cargar el rol guardado en localStorage si existe
    this.cargarRolDesdeStorage();
  }

  // Al cambiar el campo o el día, filtramos automáticamente el JSON guardado de Gemini
  cambiarCampo(nuevoCampo: string) {
    this.numeroCampo = nuevoCampo;
    this.filtrarPartidosPorFiltrosActuales();
  }

  onDiaSemanaChange() {
    this.filtrarPartidosPorFiltrosActuales();
  }

  // Método para manejar la carga de la imagen desde el HTML
  async capturarYProcesarImagen(event: any) {
    const archivo = event.target.files[0];
    if (!archivo) return;

    if (this.listaOficialEquipos.length === 0) {
      alert('Aún no se ha cargado la base de datos oficial de equipos. Inténtalo de nuevo en unos segundos.');
      return;
    }

    try {
      this.cargandoGemini = true;
      
      // Llamamos al método de tu servicio mandando la imagen y la lista oficial cargada en OnInit
      const resultado = await this.geminiService.procesarRolJuegos(archivo, this.listaOficialEquipos);
      
      // Guardamos la respuesta estructurada de Gemini
      this.rolCompletoGemini = resultado;
      this.jsonTexto = JSON.stringify(resultado, null, 2);

// NUEVO: Guardamos el JSON completo en el almacenamiento local del navegador
      localStorage.setItem('rol_juegos_aguigol', this.jsonTexto);

      // Sincronizamos el póster con el día y campo seleccionados actualmente
      this.filtrarPartidosPorFiltrosActuales();
      alert('¡Rol de juegos procesado de forma exitosa por la IA!');

    } catch (error) {
      console.error('Error al procesar con Gemini:', error);
      alert('Hubo un error al procesar la imagen con Gemini. Revisa la consola.');
    } finally {
      this.cargandoGemini = false;
    }
  }

  // NUEVO: Método para recuperar los datos cuando se refresca la pantalla
  cargarRolDesdeStorage() {
    const datosGuardados = localStorage.getItem('rol_juegos_aguigol');
    if (datosGuardados) {
      try {
        this.rolCompletoGemini = JSON.parse(datosGuardados);
        this.jsonTexto = datosGuardados;
        // Renderizamos los partidos que correspondan al día y campo seleccionados por defecto
        this.filtrarPartidosPorFiltrosActuales();
      } catch (error) {
        console.error('Error al parsear el rol del localStorage', error);
      }
    }
  }

  // Filtra los datos almacenados de Gemini según el día y campo seleccionados
  filtrarPartidosPorFiltrosActuales() {
    if (!this.rolCompletoGemini) return;

    // Convertimos el string 'LUNES' a 'Lunes' o 'MIÉRCOLES' a 'Miercoles' para coincidir con las llaves del JSON
    const diaKey = this.capitalizarDias(this.diaSemana);
    const campoKey = `Cancha ${this.numeroCampo}`;

    if (this.rolCompletoGemini[diaKey] && this.rolCompletoGemini[diaKey][campoKey]) {
      this.listaPartidos = this.rolCompletoGemini[diaKey][campoKey];
    } else {
      this.listaPartidos = []; // Vacío si no hay partidos agendados para ese día/campo
    }
  }

  // Auxiliar para formatear las llaves del JSON de Gemini ("Lunes", "Martes", "Miercoles", "Jueves")
  private capitalizarDias(dia: string): string {
    const formato: { [key: string]: string } = {
      'LUNES': 'Lunes',
      'MARTES': 'Martes',
      'MIÉRCOLES': 'Miercoles',
      'JUEVES': 'Jueves',
      'VIERNES': 'Viernes',
      'SÁBADO': 'Sabado',
      'DOMINGO': 'Domingo'
    };
    return formato[dia] || dia;
  }

actualizarPartidos() {
    try {
      const datosParseados = JSON.parse(this.jsonTexto);
      
      // Si el usuario edita o pega directamente la estructura completa (Día -> Cancha)
      if (datosParseados.Lunes || datosParseados.Martes) {
        this.rolCompletoGemini = datosParseados;
        
        // Conservamos los cambios manuales (incluyendo los IDs) en el LocalStorage
        localStorage.setItem('rol_juegos_aguigol', this.jsonTexto);
        
        this.filtrarPartidosPorFiltrosActuales();
      } else if (Array.isArray(datosParseados)) {
        // Si solo pega un arreglo plano de partidos directos
        this.listaPartidos = datosParseados;
      }
      alert('¡Posters y datos actualizados con éxito!');
    } catch (error) {
      alert('Error: El formato del JSON no es correcto. Revisa las comillas y comas.');
    }
  }

  obtenerEImprimirEquipos() {
    const ids = ['60', '59', '54', '55'];
    const peticiones = ids.map(id => this.equiposService.getTeamsByTournaments(id));

    forkJoin(peticiones).pipe(
      map((respuestas: any[][]) => {
        const todosLosDatos = respuestas.flat();
        return todosLosDatos.map(item => ({
          categoria: item.tournaments?.idName || 'Sin categoría',
          id_categoria: item.tournaments?.id ||  "sin id",
          nombreEquipo: item.teams?.name || 'Sin nombre',
           id_equipo: item.teams?.id || 'Sin id',
          logo: item.teams?.logo || 'Sin logo'
        }));
      })
    ).subscribe({
      next: (resultadoLimpio) => {
        // GUARDAMOS el resultado oficial en nuestra variable global
        this.listaOficialEquipos = resultadoLimpio;
        console.log('--- LISTA DE EQUIPOS PUESTA EN MEMORIA ---');
      },
      error: (error) => {
        console.error('Error al obtener los equipos:', error);
      }
    });
  }
}
