import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { JugadoresApiService } from '../../../service/peticiones/jugadores-api.service';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { JugadorFormComponentComponent } from "../jugador-form-component/jugador-form-component.component";

@Component({
  selector: 'app-edit-jugador',
  imports: [CommonModule, ReactiveFormsModule, RouterModule, JugadorFormComponentComponent],
  templateUrl: './edit-jugador.component.html',
  standalone: true,

  styleUrl: './edit-jugador.component.css'
})
export class EditJugadorComponent implements OnInit {
  form!: FormGroup; // usamos ! para evitar error de inicialización
  id: string = '';
  imagePreview: string | null = null;

  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private jugadoresApiService = inject(JugadoresApiService);

  ngOnInit() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      Curp: ['', Validators.required],
      Email: ['', [Validators.required, Validators.email]],
      birthDate: ['', Validators.required],
      sex: ['M', Validators.required],
      file: [null],
      Photo: [''] // 👈 aquí agregas el campo para el nombre del archivo

    });

    
    this.id = this.route.snapshot.paramMap.get('id')!;
    const token = localStorage.getItem('token');

    if (token) {
      this.jugadoresApiService.getPlayerById(this.id, token).subscribe({
        next: response => {
          const jugador = response[0]; // << tomar el primer objeto del array
          console.log('Jugador obtenido:', jugador);
        
          if (jugador) {
            this.form.patchValue({
              name: jugador.name,
              Curp: jugador.Curp,
              Email: jugador.Email,
              birthDate: jugador.birthDate,
              sex: jugador.sex
            });
            this.imagePreview = jugador.Photo; // 👈 aquí guardas la imagen
            console.log('Imagen cargada:', this.imagePreview);
          }
        },
        error: err => console.error('Error al cargar jugador:', err)
      });
    }
  }
/*
  onSubmit() {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token no encontrado.');
      return;
    }

    // const formData = new FormData();
  // formData.append('file', this.form.get('file')!.value);
  // formData.append('name', this.form.get('name')!.value);
  // formData.append('Curp', this.form.get('Curp')!.value);
  // formData.append('Email', this.form.get('Email')!.value);
  // formData.append('birthDate', this.form.get('birthDate')!.value);
  // formData.append('sex', this.form.get('sex')!.value);
    
  // for (let pair of formData.entries()) {
  //   console.log(pair[0]+ ': ' + pair[1]);
  // }

    // Creamos un objeto normal con los datos del formulario
    const jugador = {
      name: this.form.get('name')!.value,
      Curp: this.form.get('Curp')!.value,
      Email: this.form.get('Email')!.value,
      birthDate: this.form.get('birthDate')!.value,
      sex: this.form.get('sex')!.value,
      Photo: this.form.get('Photo')!.value // 👈 ahora se envía el nombre del archivo

    };
    
   
        this.jugadoresApiService.updatePlayer(this.id, jugador, token).subscribe({
      next: () => this.router.navigate(['/jugadores']),
      error: err => console.error('Error al actualizar jugador:', err)
    });
  }
*/

onSubmit() {
  const token = localStorage.getItem('token');
  if (!token) {
    console.error('Token no encontrado.');
    return;
  }

  const formData = new FormData();

  const file = this.form.get('file')!.value;
  if (file) {
   
  // Agregar el archivo renombrado al FormData
  formData.append('file', file);

  // También puedes agregar el nuevo nombre en otro campo (como Photo) si es necesario
    formData.append('Photo', file.name); // 👈 el nombre del archivo
  }

  // Agrega los otros datos
  formData.append('name', this.form.get('name')!.value);
  formData.append('Curp', this.form.get('Curp')!.value);
  formData.append('Email', this.form.get('Email')!.value);
  formData.append('birthDate', this.form.get('birthDate')!.value);
  formData.append('sex', this.form.get('sex')!.value);

  this.jugadoresApiService.updatePlayer(this.id, formData, token).subscribe({
    next: () => this.router.navigate(['/jugadores']),
    error: err => console.error('Error al actualizar jugador:', err)
  });
}

onFileChange(event: any) {
  const file = event.target.files[0];
  
  if (file && this.id) {


    // Obtener extensión del archivo original
    const extension = file.name.split('.').pop();

    // Crear fecha y hora actual en formato YYYYMMDD_HHMMSS
    const now = new Date();
    const fechaHora =
      now.getFullYear().toString() +
      (now.getMonth() + 1).toString().padStart(2, '0') +
      now.getDate().toString().padStart(2, '0') + '_' +
      now.getHours().toString().padStart(2, '0') +
      now.getMinutes().toString().padStart(2, '0') +
      now.getSeconds().toString().padStart(2, '0');

    // Nuevo nombre del archivo: id_fechaHora.extensión
    const newFileName = `${this.id}_${fechaHora}.${extension}`;

    // Crear nuevo archivo con el nuevo nombre
    const renamedFile = new File([file], newFileName, {
      type: file.type,
      lastModified: file.lastModified
    });


    // Asignamos el nuevo archivo al formulario
    this.form.patchValue({ file: renamedFile });
  }
}
}
