import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../environments/environment';
import { JugadoresApiService } from '../../../service/peticiones/jugadores-api.service';
import { JugadorFormComponentComponent } from "../jugador-form-component/jugador-form-component.component";

@Component({
  selector: 'app-new-jugador',
  standalone: true,

  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    JugadorFormComponentComponent
],  templateUrl: './new-jugador.component.html',
  styleUrl: './new-jugador.component.css'
})
export class NewJugadorComponent {
  form: FormGroup;
  private baseUrl = environment.baseUrl;
  private jugadoresApiService = inject(JugadoresApiService);


  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.form = this.fb.group({
      name: [''],
      Curp: [''],
      Email: [''],
      birthDate: [''],
      sex: ['M'],
      file: [null]
    });
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.form.patchValue({ file: file });
    }
  }

  onSubmit() {
    const token = localStorage.getItem('token');
    
    // Verifica si el token está vacío o nulo
    if (!token) {
      console.error('No se encontró un token de autenticación.');
      return;  // No hacemos nada más si no hay token
    }
  
    // Crear FormData directamente en el onSubmit
    const formData = new FormData();
    formData.append('file', this.form.get('file')!.value);
    formData.append('name', this.form.get('name')!.value);
    formData.append('Curp', this.form.get('Curp')!.value);
    formData.append('Email', this.form.get('Email')!.value);
    formData.append('birthDate', this.form.get('birthDate')!.value);
    formData.append('sex', this.form.get('sex')!.value);
  
    for (let pair of formData.entries()) {
      console.log(pair[0]+ ': ' + pair[1]);
    }

    this.jugadoresApiService.addPlayers(formData, token).subscribe({
      next: () => this.router.navigate(['/jugadores']),
      error: (err) => console.error('Error al guardar:', err)
    });
  }
  
}
