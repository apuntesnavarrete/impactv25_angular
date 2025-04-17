// jugador-form.component.ts
import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-jugador-form-component',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './jugador-form-component.component.html',
  styleUrl: './jugador-form-component.component.css'
})

export class JugadorFormComponentComponent {
  @Input() form!: FormGroup;
  @Input() submitButtonText: string = 'Guardar';
  @Output() submitForm = new EventEmitter<void>();
  @Output() fileChange = new EventEmitter<any>();
  @Input() imagePreview: string | null = null;
    apiruta: string = environment.baseUrlPublic  // Replace with actual API base URL

  onFileChange(event: any) {
    this.fileChange.emit(event);
  }

  onSubmit() {
    this.submitForm.emit();
  }
}