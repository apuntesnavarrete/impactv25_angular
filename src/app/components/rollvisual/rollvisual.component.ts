import { Component, ElementRef, ViewChild } from '@angular/core';
import html2canvas from 'html2canvas';
import { BtnDescargarComponent } from '../utils/btn-descargar/btn-descargar.component';
import { FilarollComponent } from './filaroll/filaroll.component';

@Component({
  selector: 'app-rollvisual',
  imports: [BtnDescargarComponent, FilarollComponent], // Si necesitas CommonModule o pipes en el futuro, van aquí
  templateUrl: './rollvisual.component.html',
  styleUrl: './rollvisual.component.css'
})
export class RollvisualComponent {

  // Variable dinámica para el número de campo ($)
  numeroCampo: string = '1'; 
// Nueva variable para el día (en mayúsculas para el diseño)
  diaSemana: string = 'LUNES';

// Si esta lista tiene 2 elementos, se dibujarán 2; si tiene 3, se dibujarán 3 de forma automática.
listaPartidos = [
  {
    "categoria": "sub 16",
    "local": "Juventus",
    "localLogo": "juventus.png",
    "visitante": "Arsenal",
    "visitanteLogo": "arsenal.png",
    "horario": "7:20pm"
  },
  {
    "categoria": "sub 16",
    "local": "AC milan",
    "localLogo": "milan.png",
    "visitante": "España",
    "visitanteLogo": "españa.png",
    "horario": "8:10"
  },
  {
    "categoria": "mixto",
    "local": "Alemania",
    "localLogo": "alemania.png",
    "visitante": "Chelsea",
    "visitanteLogo": "chelsea.png",
    "horario": "9:00"
  },
  {
    "categoria": "mixto",
    "local": "CFT",
    "localLogo": "cft.png",
    "visitante": "Bayer",
    "visitanteLogo": "bayer.png",
    "horario": "9:50"
  },
  {
    "categoria": "mixto",
    "local": "Tepatitlan",
    "localLogo": "tepatitlan.png",
    "visitante": "Palmeiras",
    "visitanteLogo": "palmeiras.png",
    "horario": "10:40"
  }
];

  // Referencia para capturar el contenedor del póster
  @ViewChild('poster', { static: false }) posterElement!: ElementRef;

  // Función para cambiar el valor desde los botones
  cambiarCampo(nuevoCampo: string) {
    this.numeroCampo = nuevoCampo;
  }


}
