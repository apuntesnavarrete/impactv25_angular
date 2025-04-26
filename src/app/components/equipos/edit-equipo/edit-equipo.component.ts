import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { EquipoFormComponent } from '../equipo-form/equipo-form.component';
import { EquiposApiService } from '../../../service/peticiones/teams/teams.service';

@Component({
  selector: 'app-edit-equipo',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, EquipoFormComponent],
  templateUrl: './edit-equipo.component.html',
})
export class EditEquipoComponent implements OnInit {
  form: FormGroup;
  submitButtonText = 'Actualizar equipo';
  imagePreview: string | null = null;
  equipoId!: string;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private equiposService: EquiposApiService
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      Date: ['', Validators.required],
      logo: [''] // solo nombre o File
    });
  }

  ngOnInit(): void {
    this.equipoId = this.route.snapshot.paramMap.get('id') || '';
    const token = localStorage.getItem('token') || '';
  
    this.equiposService.getTeamById(this.equipoId, token).subscribe({
      next: (data) => {
        this.form.patchValue({
          name: data[0].name,
          Date: data[0].Date,
          logo: '' // no se carga el archivo, pero dejamos el campo listo
        });
        this.imagePreview = data.logo; // Aquí puedes ver cómo se carga la imagen o logo
      },
      error: (err) => {
        console.error('Error al cargar el equipo:', err);
      }
    });
  }
  

  onSubmit() {
    if (this.form.valid) {
      const token = localStorage.getItem('token') || '';
      const logoFile = this.form.value.logo;

      let body: any = this.form.value;

      if (logoFile instanceof File) {
        const formData = new FormData();
        formData.append('name', this.form.value.name);
        formData.append('Date', this.form.value.Date);
        formData.append('file', logoFile);
        body = formData;
      }

      this.equiposService.updateTeam(this.equipoId, body, token).subscribe({
        next: () => {
          console.log('Equipo actualizado');
          this.router.navigate(['/equipos']);
        },
        error: (err) => {
          console.error('Error al actualizar el equipo:', err);
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
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }
}
