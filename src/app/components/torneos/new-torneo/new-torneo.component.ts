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

  constructor(
    private fb: FormBuilder,
    private torneosService: TournamentsApiService,
    private router: Router
  ) {
    this.form = this.fb.group({
      idName: ['', Validators.required],

      description: [''],
      date_fundation: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.form.valid) {
      const token = localStorage.getItem('token') || '';
      const data = {
        idName: this.form.value.idName,

        description: this.form.value.description,
        date_fundation: this.form.value.date_fundation
      };
  
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
