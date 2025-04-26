import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EquipoFormComponent } from '../equipo-form/equipo-form.component';
import { Router } from '@angular/router';
import { EquiposApiService } from '../../../service/peticiones/teams/teams.service';

@Component({
  selector: 'app-new-equipo',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, EquipoFormComponent],
  templateUrl: './new-equipo.component.html',
})
export class NewEquipoComponent {
  form: FormGroup;
  submitButtonText = 'Crear equipo';
  imagePreview: string | null = null;

  constructor(
    private fb: FormBuilder,
    private equiposService: EquiposApiService,
    private router: Router
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      Date: ['', Validators.required],
      logo: ['']
    });
  }

  onSubmit() {
    if (this.form.valid) {
      const token = localStorage.getItem('token') || '';

      const formData = new FormData();
      formData.append('name', this.form.value.name);
      formData.append('Date', this.form.value.Date);

      const logoFile = this.form.value.logo;
      if (logoFile) {
        formData.append('file', logoFile);
      }

      this.equiposService.addTeam(formData, token).subscribe({
        next: () => {
          console.log('Equipo creado');
          this.router.navigate(['/equipos']);
        },
        error: (err) => {
          console.error('Error al crear el equipo:', err);
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
        // también puedes mostrar preview base64 con: reader.result as string
      };
      reader.readAsDataURL(file);
    }
  }
}

