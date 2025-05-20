import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-menu-categoria',
  imports: [RouterModule],
  templateUrl: './menu-categoria.component.html',
  styleUrl: './menu-categoria.component.css'
})
export class MenuCategoriaComponent implements OnInit{


  constructor( private route: ActivatedRoute ){}

ngOnInit(): void {
  const categoria = this.route.snapshot.paramMap.get('Categoria');
  console.log('categoria:', categoria);
}
}
