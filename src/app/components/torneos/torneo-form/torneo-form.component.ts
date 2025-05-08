import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-torneo-form',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './torneo-form.component.html',
  styleUrls: ['./torneo-form.component.css']
})
export class TorneoFormComponent {
  @Input() form!: FormGroup;
  @Input() submitButtonText: string = 'Guardar';
  @Input() categories: { id: number; categorias: string }[] = [];
  @Output() submitForm = new EventEmitter<void>();
  @Input() leagues: { id: number; name: string }[] = []; // Asegúrate que este array venga correctamente.

  onSubmit() {
    this.submitForm.emit();
  }
}


