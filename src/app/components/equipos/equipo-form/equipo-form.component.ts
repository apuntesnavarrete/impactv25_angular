import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-equipo-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './equipo-form.component.html',
  styleUrl: './equipo-form.component.css'
})
export class EquipoFormComponent {
  @Input() form!: FormGroup;
  @Input() submitButtonText: string = 'Guardar';
  @Output() submitForm = new EventEmitter<void>();
  @Output() fileChange = new EventEmitter<any>();
  @Input() imagePreview: string | null = null;

  apiruta: string = environment.baseUrlPublic;

  onFileChange(event: any) {
    this.fileChange.emit(event);
  }

  onSubmit() {
    this.submitForm.emit();
  }
}
