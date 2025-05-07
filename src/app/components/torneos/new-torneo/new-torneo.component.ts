import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TorneoFormComponent } from '../torneo-form/torneo-form.component';
import { Router } from '@angular/router';
import { TournamentsApiService } from '../../../service/peticiones/torneos/torneos.service';

@Component({
  selector: 'app-new-torneo',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TorneoFormComponent],
  templateUrl: './new-torneo.component.html',
})
export class NewTorneoComponent {
  form: FormGroup;
  submitButtonText = 'Crear torneo';

  // Opciones para el select de liga y categoría
  leagues = [
    { id: 2, name: 'Liga ED' },
    { id: 3, name: 'Liga Pro' }
  ];

  categories = [
    { id: 2, name: 'Mixta' },
    { id: 4, name: 'Libre' }
  ];

  constructor(
    private fb: FormBuilder,
    private torneosService: TournamentsApiService,
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

