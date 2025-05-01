import { Component, inject, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../service/auth/auth.service';
import { CreateTableMainComponent } from '../../create/create-table-main/create-table-main.component';
import { CategoriasService } from '../../../service/peticiones/categorias/categorias.service';

@Component({
  selector: 'app-categoria',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, CreateTableMainComponent],
  templateUrl: './categoria.component.html',
  styleUrls: ['./categoria.component.css']
})
export class CategoriaComponent implements OnInit {
  private categoriesApiService = inject(CategoriasService);
  private authService = inject(AuthService);

  categorias: any[] = [];
  apiruta: string = environment.baseUrlPublic;
  searchQuery: string = '';
  isLoggedIn = false;

  columns = [
    { header: 'ID', key: 'id' },
    { header: 'Nombre de Categoría', key: 'categorias' },
    { header: 'Descripción', key: 'description' },
    { header: 'Creado', key: 'createdAt' },
    { header: 'Actualizado', key: 'updatedAt' }
  ];

  ngOnInit(): void {
    this.categoriesApiService.getAllCategories().subscribe((data: any) => {
      this.categorias = data;
      console.log(data)
    });

    this.isLoggedIn = this.authService.isLoggedIn();
  }

  filteredCategories() {
    console.log('Filtro aplicado:', this.searchQuery);
    if (!this.searchQuery) {
      console.log('Mostrando todas las categorías:', this.categorias);
      return this.categorias.slice().reverse();
    }
    const query = this.searchQuery.toLowerCase();
    const filtradas = this.categorias.filter(cat =>
      cat.categorias.toLowerCase().includes(query) ||
      cat.id.toString().includes(query)
    ).reverse();
    console.log('Resultados filtrados:', filtradas);
    return filtradas;
  }
}

