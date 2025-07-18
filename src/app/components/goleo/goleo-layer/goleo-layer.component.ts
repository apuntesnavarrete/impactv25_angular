


import { CommonModule } from '@angular/common';
import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { BtnDescargarComponent } from '../../utils/btn-descargar/btn-descargar.component';

@Component({
  selector: 'app-goleo-layer',
    standalone: true,

  imports: [CommonModule,BtnDescargarComponent],
  templateUrl: './goleo-layer.component.html',
  styleUrl: './goleo-layer.component.css'
})
export class GoleoLayerComponent {
  @Input() liga?: string;
  @Input() torneo?: string;
  @Input() goleadores: any[] = [];
  @Input() tipoTorneo!: string;
  @Input() infoType!: 'Global' | 'torneo';
  @Input() order!: string;

  @ViewChild('cardgoleador') cardgoleadorRef!: ElementRef;

  get top5Goleadores() {
    return this.goleadores?.slice(0, 5) || [];
  }

  // Simula funciones de React
  date = new Date().toLocaleDateString(); // reemplaza useTodayDate()
apiruta = environment.baseUrlPublic;

  obtenerPrimerYtercerNombre(nombre: string): string {
    const partes = nombre.split(' ');
    return partes[0] + ' ' + (partes[2] || '');
  }
}
