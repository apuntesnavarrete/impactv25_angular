import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TorneoFormComponent } from '../torneo-form/torneo-form.component';
import { Router } from '@angular/router';
import { TournamentsApiService } from '../../../service/peticiones/torneos/torneos.service';
import { LigasService } from '../../../service/peticiones/ligas/ligas.service';
import { CategoriasService } from '../../../service/peticiones/categorias/categorias.service';
import { OnInit } from '@angular/core';

@Component({
  selector: 'app-new-torneo',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TorneoFormComponent],
  templateUrl: './new-torneo.component.html',
})
export class NewTorneoComponent {
  form: FormGroup;
  submitButtonText = 'Crear torneo';


leagues: any[] = [];
categories: any[] = [];

  constructor(
    private fb: FormBuilder,
    private torneosService: TournamentsApiService,
    private ligasService: LigasService, // 👈 inyectar servicio de ligas
    private categoriesService: CategoriasService, // 👈 inyectar servicio de ligas

    private router: Router
  ) {
    this.form = this.fb.group({
      idName: ['', Validators.required],
      description: [''],
      date_fundation: ['', Validators.required],
      leagueId: [null, Validators.required],  // nuevo campo
      categoryId: [null, Validators.required]  // nuevo campo
    });
  }

  ngOnInit(): void {
    this.ligasService.getAllLeagues().subscribe((data: any[]) => {
      this.leagues = data;
      console.log(data)
    });
  
    this.categoriesService.getAllCategories().subscribe((data: any[]) => {
      this.categories = data;
      console.log(data)

    });
  }

  onSubmit() {
    if (this.form.valid) {
      const token = localStorage.getItem('token') || '';
      const data = {
        idName: this.form.value.idName,
        description: this.form.value.description,
        date_fundation: this.form.value.date_fundation,
        leagues: +this.form.value.leagueId,  // Convertimos a número con el operador "+"
        categories: +this.form.value.categoryId  //
        //revisar como guardar este dato en un ejemplo de la version anterior
      };
   

      console.log(data)

      this.torneosService.addTournament(data, token).subscribe({
        next: () => {
          console.log('Torneo creado');
          this.router.navigate(['/torneos']);
        },
        error: (err) => {
          console.error('Error al crear el torneo:', err);
        }
      });
    }
  }
}

