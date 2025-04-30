import { Component, inject, OnInit } from '@angular/core';
import { CreateTableMainComponent } from "../../create/create-table-main/create-table-main.component";
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../service/auth/auth.service';
import { environment } from '../../../../environments/environment';
import { TournamentsApiService } from '../../../service/peticiones/torneos/torneos.service';

@Component({
  selector: 'app-torneo',
  standalone: true,
  imports: [CreateTableMainComponent, CommonModule,ReactiveFormsModule,RouterModule],
  templateUrl: './torneo.component.html',
  styleUrl: './torneo.component.css'
})
export class TorneoComponent implements OnInit {
 private tournamentsApiService = inject(TournamentsApiService);
  private authService = inject(AuthService); // 👈 Inyección

  torneos: any[] = [];  // Propiedad para almacenar los equipos
  apiruta: string = environment.baseUrlPublic;  // URL base de la API
  searchQuery: string = '';  // Propiedad para la búsqueda
  isLoggedIn = false; // Determina si el usuario está logueado

  columns = [
    { header: 'ID', key: 'id' },
    { header: 'ID Nombre', key: 'idName' },
    { header: 'Descripción', key: 'description' },
    { header: 'Fecha de Fundación', key: 'date_fundation' },
    { header: 'Creado', key: 'createdAt' },
    { header: 'Actualizado', key: 'updatedAt' }
  ];

  ngOnInit(): void {
    this.tournamentsApiService.getTournaments().subscribe((data: any) => {
      console.log(data)
      this.torneos = data; // Almacena los datos de los equipos
    });

    this.isLoggedIn = this.authService.isLoggedIn(); // Verifica si el usuario está logueado
  }


  filteredTournaments() {
    console.log('Torneos filtered:', this.torneos);  // Verifica qué datos tienes en 'torneos'
    if (!this.searchQuery) {
      console.log('Sin filtro:', this.torneos);
      return this.torneos.slice();
    }
    const query = this.searchQuery.toLowerCase();
    const filtered = this.torneos
      .filter(tournament =>
        tournament.idName.toLowerCase().includes(query) ||
        tournament.description?.toLowerCase().includes(query) ||
        tournament.id.toString().includes(query)
      )
      
    console.log('Torneos filtrados:', filtered);  // Verifica los torneos filtrados
    return filtered;
  }


}
