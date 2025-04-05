import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JugadoresApiService } from '../../service/peticiones/jugadores-api.service';
import { RouterModule } from '@angular/router'; // For handling the routerLink for Edit
import { FormsModule } from '@angular/forms'; // Import FormsModule for ngModel

@Component({
  selector: 'app-jugadores',
  templateUrl: './jugadores.component.html',
  styleUrls: ['./jugadores.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule], // Add FormsModule here for ngModel
  providers: [
    JugadoresApiService // Only component-specific services
  ]
})
export class JugadoresComponent implements OnInit {
  private jugadoresApiService = inject(JugadoresApiService);
  jugadores: any[] = [];  // Property to store players' data
  apiruta: string = 'your_api_base_url';  // Replace with actual API base URL
  searchQuery: string = '';  // Search query property

  ngOnInit(): void {
    this.jugadoresApiService.getPlayers().subscribe((data: any) => {
      console.log(data); // For debugging, check the fetched data
      this.jugadores = data; // Store the players data in the jugadores property
    });
  }

  // Filter method for search functionality
  filteredPlayers() {
    if (!this.searchQuery) {
      return this.jugadores;
    }
    const query = this.searchQuery.toLowerCase();
    return this.jugadores.filter(jugador =>
      jugador.name.toLowerCase().includes(query) || // Search by name
      jugador.id.toString().includes(query) // Search by ID (converted to string for comparison)
    );
  }
}

