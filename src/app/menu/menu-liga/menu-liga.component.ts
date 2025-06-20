import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TournamentsApiService } from '../../service/peticiones/torneos/torneos.service';
import { RouterModule } from '@angular/router'; // 👈 Importa RouterModule
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-menu-liga',
  standalone: true, // Indicamos que el componente es standalone
  imports: [RouterModule, CommonModule], // Asegúrate de que RouterModule esté en imports
  templateUrl: './menu-liga.component.html',
})
export class MenuLigaComponent implements OnInit {

  constructor(private route: ActivatedRoute) {}

  private tournamentsApiService = inject(TournamentsApiService);

  categoryNames: string[] = [];

  ngOnInit() {
  const liga = this.route.snapshot.paramMap.get('liga');
  
  if (liga) {
    this.tournamentsApiService.getUniqueCategoriesByLeague(liga).subscribe((data: string[]) => {
      console.log(data)
      this.categoryNames = data;
    });
  }
}
}

