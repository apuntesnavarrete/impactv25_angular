import { Component } from '@angular/core';
import { AsistenciasService } from '../../../../service/peticiones/asistencias/asistencias.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { GoleoLayerComponent } from '../../../../components/goleo/goleo-layer/goleo-layer.component';

@Component({
  selector: 'app-asistenciabymes',
  imports: [FormsModule,CommonModule,GoleoLayerComponent],
  templateUrl: './asistenciabymes.component.html',
  styleUrl: './asistenciabymes.component.css'
})
export class AsistenciabymesComponent {
 asistencias: any[] = [];
  anio: number = new Date().getFullYear();
  mes: number = new Date().getMonth() + 1;
  mostrarResultados = false;
nombreTorneo: string = '';


  constructor(private asistenciasService: AsistenciasService) {}


obtenerGoleadoresDelMes() {
  this.asistenciasService.getTopAsistenciasDelMes(this.anio, this.mes).subscribe(data => {
    this.asistencias = data;
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
