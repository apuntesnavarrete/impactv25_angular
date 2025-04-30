import { Component, inject, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../service/auth/auth.service';
import { CreateTableMainComponent } from '../../create/create-table-main/create-table-main.component';
import { LigasService } from '../../../service/peticiones/ligas/ligas.service';

@Component({
  selector: 'app-liga',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, CreateTableMainComponent],
  templateUrl: './liga.component.html',
  styleUrls: ['./liga.component.css']
})
export class LigaComponent implements OnInit {
  private leaguesApiService = inject(LigasService);
  private authService = inject(AuthService);

  leagues: any[] = [];
  apiruta: string = environment.baseUrlPublic;
  searchQuery: string = '';
  isLoggedIn = false;

  columns = [
    { header: 'ID', key: 'id' },
    { header: 'Nombre', key: 'name' },
    { header: 'Alias', key: 'Alias' },
    { header: 'Logo', key: 'logo', type: 'image' },
    { header: 'Fecha de Fundación', key: 'date_fundation' },
    { header: 'Creado', key: 'createdAt' },
    { header: 'Actualizado', key: 'updatedAt' }
  ];

  ngOnInit(): void {
    this.leaguesApiService.getAllLeagues().subscribe((data: any) => {
      this.leagues = data;
    });

    this.isLoggedIn = this.authService.isLoggedIn();
  }

  filteredLeagues() {
    if (!this.searchQuery) {
      return this.leagues.slice().reverse();
    }
    const query = this.searchQuery.toLowerCase();
    return this.leagues
      .filter(league =>
        league.name.toLowerCase().includes(query) ||
        league.id.toString().includes(query) ||
        (league.Alias && league.Alias.toLowerCase().includes(query))
      )
      .reverse();
  }
}

