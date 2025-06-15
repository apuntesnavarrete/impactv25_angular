import { Component, OnInit } from '@angular/core';
import { TablaGeneralService } from '../../../service/peticiones/tablageneral/tabla-general.service';
import { CommonModule } from '@angular/common';
import { TablaGeneralLayerComponent } from '../../../components/tablageneralLayer/tablageneral-layer/tablageneral-layer.component';
import { BtnDescargarComponent } from '../../../components/utils/btn-descargar/btn-descargar.component';

@Component({
  selector: 'app-tablageneral',
  standalone: true,
  imports: [CommonModule, TablaGeneralLayerComponent, BtnDescargarComponent],
  templateUrl: './tablageneral.component.html',
  styleUrls: ['./tablageneral.component.css']
})
export class TablageneralComponent implements OnInit {
  clasificacion: any[] = [];

  constructor(private tablaService: TablaGeneralService) {}

  ngOnInit(): void {
    this.tablaService.getTablaGeneralById(1).subscribe((data: any) => {
      console.log(data);
      this.clasificacion = data;
    });
  }
}
