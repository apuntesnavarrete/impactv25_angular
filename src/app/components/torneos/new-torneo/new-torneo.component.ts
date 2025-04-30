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
  imagePreview: string | null = null;

  constructor(
    private fb: FormBuilder,
    private torneosService: TournamentsApiService,
    private router: Router
  ) {
    this.form = this.fb.group({
      idName: ['', Validators.required],
      description: [''],
      date_fundation: ['', Validators.required],
      logo: ['']
    });
  }

  onSubmit() {
    if (this.form.valid) {
      const token = localStorage.getItem('token') || '';

      const formData = new FormData();
      formData.append('idName', this.form.value.idName);
      formData.append('description', this.form.value.description);
      formData.append('date_fundation', this.form.value.date_fundation);

      const logoFile = this.form.value.logo;
      if (logoFile) {
        formData.append('file', logoFile);
      }

      this.torneosService.addTournament(formData, token).subscribe({
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

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.form.patchValue({ logo: file });

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = file.name;
      };
      reader.readAsDataURL(file);
    }
  }
}
