import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-new-jugador',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],  templateUrl: './new-jugador.component.html',
  styleUrl: './new-jugador.component.css'
})
export class NewJugadorComponent {
  form: FormGroup;
  private baseUrl = environment.baseUrl;


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
    const formData = new FormData();
    formData.append('file', this.form.get('file')!.value);
    formData.append('name', this.form.get('name')!.value);
    formData.append('Curp', this.form.get('Curp')!.value);
    formData.append('Email', this.form.get('Email')!.value);
    formData.append('birthDate', this.form.get('birthDate')!.value);
    formData.append('sex', this.form.get('sex')!.value);

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.http.post(`${this.baseUrl}/participants` , formData, { headers })
      .subscribe({
        next: () => this.router.navigate(['/jugadores']),
        error: (err) => console.error('Error submitting form:', err)
      });
  }
}
