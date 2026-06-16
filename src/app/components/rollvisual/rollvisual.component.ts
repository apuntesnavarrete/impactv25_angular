import { Component, ElementRef, ViewChild } from '@angular/core';
import html2canvas from 'html2canvas';
import { BtnDescargarComponent } from '../utils/btn-descargar/btn-descargar.component';
import { FilarollComponent } from './filaroll/filaroll.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-rollvisual',
  imports: [BtnDescargarComponent, FilarollComponent, FormsModule], // Si necesitas CommonModule o pipes en el futuro, van aquí
  templateUrl: './rollvisual.component.html',
  styleUrl: './rollvisual.component.css'
})
export class RollvisualComponent {

  // Variable dinámica para el número de campo ($)
  numeroCampo: string = '1'; 
// Nueva variable para el día (en mayúsculas para el diseño)
  diaSemana: string = 'LUNES';

// Esta será la lista que dibuja el póster (empieza con tus datos de ejemplo)
  listaPartidos = [
    {
      "categoria": "sub 16",
      "local": "Juventus",
      "localLogo": "juventus.png",
      "visitante": "Arsenal",
      "visitanteLogo": "arsenal.png",
      "horario": "7:20pm"
    }
  ];

  // 👈 Nueva variable para el texto que pegues en el HTML
  jsonTexto: string = JSON.stringify(this.listaPartidos, null, 2);

  // Referencia para capturar el contenedor del póster
  @ViewChild('poster', { static: false }) posterElement!: ElementRef;

  // Función para cambiar el valor desde los botones
  cambiarCampo(nuevoCampo: string) {
    this.numeroCampo = nuevoCampo;
  }

  // 👈 Nueva función para procesar el JSON desde la pantalla
  actualizarPartidos() {
    try {
      this.listaPartidos = JSON.parse(this.jsonTexto);
      alert('¡Partidos actualizados con éxito en el póster!');
    } catch (error) {
      alert('Error: El formato del JSON no es correcto. Revisa las comillas y comas.');
    }
  }

}
