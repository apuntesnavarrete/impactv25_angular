import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-menu-categoria',
  imports: [RouterModule, CommonModule],
  templateUrl: './menu-categoria.component.html',
  styleUrl: './menu-categoria.component.css'
})
export class MenuCategoriaComponent implements OnInit{


  constructor( private route: ActivatedRoute ){}

ngOnInit(): void {
  const categoria = this.route.snapshot.paramMap.get('Categoria');
  console.log('categoria:', categoria);
}

 menu = [
    {
      title: 'Primera vez',
      suboptions: [
        { label: 'Plantillas Pasadas', path: 'opcion1' },
      ]
    },
    {
      title: 'Históricos',
      suboptions: [
        { label: 'Goleo', path: 'GoleoHistorico' },
        { label: 'General', path: 'GeneralHistorico' },
      ]
    },
    {
      title: 'Ver',
      suboptions: [
      { label: 'Goleo', path: 'goleo' },
        { label: 'General', path: 'general' },
        { label: 'Partidos', path: 'partidos' },
        { label: 'Planteles', path: 'planteles' },
        { label: 'Equipos', path: 'equipos' },
        { label: 'Roll', path: 'roll' }
      ]
    },
    {
      title: 'Agregar',
      suboptions: [
        { label: 'Partidos', path: 'AgregarPartidos' },
        { label: 'Planteles', path: 'AgregarPlanteles' },
        { label: 'Equipos', path: 'AgregarEquipos' },
      ]
    }
  ];
  selectedMenuIndex: number | null = null;

  toggleSubmenu(index: number) {
    this.selectedMenuIndex = this.selectedMenuIndex === index ? null : index;
  }


}
