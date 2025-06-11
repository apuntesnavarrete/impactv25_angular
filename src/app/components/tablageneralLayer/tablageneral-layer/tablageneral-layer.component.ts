


import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-tabla-general-layer',
 templateUrl: './tablageneral-layer.component.html',
  styleUrl: './tablageneral-layer.component.css',
    imports: [CommonModule],

})
export class TablaGeneralLayerComponent {
  @Input() clasificacion: any[] = [];
  @Input() liga?: string;
  @Input() typeTorneo!: string;
  @Input() torneo?: string;
date: string = new Date().toLocaleDateString(); // simple fallback para `useTodayDate()`

get claseCSS(): string {
  if (this.liga === 'ED') return 'ligaFondoED';
  if (this.liga === 'PRO') return 'ligaFondoProchampions';
  return '';
}


  getPromedio(puntos: number, partidosJugados: number): string {
    if (partidosJugados === 0) return '0.00';
    return (puntos / partidosJugados).toFixed(2);
  }

  getDFG(equipo: any): number {
    return equipo.goles - equipo.golesRecibidos;
  }
}
