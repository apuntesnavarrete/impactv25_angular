import { Component, inject, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EquiposApiService } from '../../../service/peticiones/teams/teams.service';
import { AuthService } from '../../../service/auth/auth.service';
import { CreateTableMainComponent } from "../../create/create-table-main/create-table-main.component";  // Asegúrate de importar el componente

@Component({
  selector: 'app-equipos',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, CreateTableMainComponent], // Importa el FormsModule y CreateTableMainComponent
  templateUrl: './equipos.component.html',
  styleUrls: ['./equipos.component.css']
})
export class EquiposComponent implements OnInit {
  private EquiposApiService = inject(EquiposApiService);
  private authService = inject(AuthService); // 👈 Inyección

  equipos: any[] = [];  // Propiedad para almacenar los equipos
  apiruta: string = environment.baseUrlPublic;  // URL base de la API
  searchQuery: string = '';  // Propiedad para la búsqueda
  isLoggedIn = false; // Determina si el usuario está logueado

  // Definir las columnas para la tabla
  columns = [
    { header: 'ID', key: 'id' },
    { header: 'Nombre', key: 'name' },
    { header: 'Logo', key: 'logo', type: 'image' },
    { header: 'Fecha de Fundación', key: 'Date' },
    { header: 'Creado', key: 'createdAt' },
    { header: 'Actualizado', key: 'updatedAt' }
  ];

  // Método que se ejecuta cuando el componente se inicializa
  ngOnInit(): void {
    this.EquiposApiService.getTeams().subscribe((data: any) => {
      this.equipos = data; // Almacena los datos de los equipos
    });

    this.isLoggedIn = this.authService.isLoggedIn(); // Verifica si el usuario está logueado
  }

  // Método para filtrar los equipos según la búsqueda
  filteredTeams() {
    if (!this.searchQuery) {
      return this.equipos.slice().reverse(); // Invierte si no hay búsqueda
    }
    const query = this.searchQuery.toLowerCase();
    return this.equipos
      .filter(team =>
        team.name.toLowerCase().includes(query) ||
        team.id.toString().includes(query)
      )
      .reverse(); // Invierte los resultados filtrados
  }
}
