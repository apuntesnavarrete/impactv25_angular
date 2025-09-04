import { Component } from '@angular/core';
import { GoleoLayerComponent } from "../../../../components/goleo/goleo-layer/goleo-layer.component";
import { GoleadoresService } from '../../../../service/peticiones/goleo/goleadores.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-goleobymes',
  imports: [GoleoLayerComponent, FormsModule,CommonModule],
  templateUrl: './goleobymes.component.html',
  styleUrl: './goleobymes.component.css'
})
export class GoleobymesComponent {
 goleadores: any[] = [];
  anio: number = new Date().getFullYear();
  mes: number = new Date().getMonth() + 1;
  mostrarResultados = false;
nombreTorneo: string = '';

  constructor(private goleadoresService: GoleadoresService) {}



obtenerGoleadoresDelMes() {
  this.goleadoresService.getGoleadoresDelMes(this.anio, this.mes).subscribe(data => {
    this.goleadores = data;
    this.nombreTorneo = this.obtenerNombreMes(this.mes) + '-' + this.anio;
    this.mostrarResultados = true;
  });
}

  obtenerNombreMes(mes: number): string {
  const meses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  return meses[mes - 1] || '';
}
}
