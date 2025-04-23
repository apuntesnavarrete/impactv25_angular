import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JugadoresApiService } from '../../service/peticiones/jugadores-api.service';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../service/auth/auth.service';
import { environment } from '../../../environments/environment';
import { CreateTableMainComponent } from "../../components/create/create-table-main/create-table-main.component";

@Component({
  selector: 'app-jugadores',
  templateUrl: './jugadores.component.html',
  styleUrls: ['./jugadores.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, CreateTableMainComponent],
  providers: [JugadoresApiService]
})
export class JugadoresComponent implements OnInit {
  private jugadoresApiService = inject(JugadoresApiService);
  private authService = inject(AuthService);

  jugadores: any[] = []; // Aquí se guarda el resultado de la API
  apiruta: string = environment.baseUrlPublic; // Ruta base para mostrar las imágenes

  searchQuery: string = ''; // Para la barra de búsqueda
  isLoggedIn = false;

  // 💡 Esta propiedad define las columnas que se mostrarán en el componente genérico
  columns = [
    { header: 'ID', key: 'id' },
    { header: 'Nombre', key: 'name' },
    { header: 'Foto', key: 'Photo', type: 'image' },
    { header: 'Sexo', key: 'sex' },
    { header: 'Nacimiento', key: 'birthDate' },
    { header: 'Curp', key: 'Curp' },
    { header: 'Email', key: 'Email' }
  ];

  ngOnInit(): void {
    // 🛰️ Cargar los datos desde el servicio
    this.jugadoresApiService.getPlayers().subscribe((data: any) => {
      this.jugadores = data;
    });

    // 🔐 Verificar si el usuario está logueado
    this.isLoggedIn = this.authService.isLoggedIn();
  }

  // 🔍 Método para filtrar jugadores por nombre o ID
  filteredPlayers() {
    if (!this.searchQuery) {
      return this.jugadores.slice().reverse();
    }
    const query = this.searchQuery.toLowerCase();
    return this.jugadores
      .filter(jugador =>
        jugador.name.toLowerCase().includes(query) ||
        jugador.id.toString().includes(query)
      )
      .reverse();
  }
}

