import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-torneo-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './torneo-form.component.html',
  styleUrls: ['./torneo-form.component.css']
})
export class TorneoFormComponent {
  @Input() form!: FormGroup;
  @Input() submitButtonText: string = 'Guardar';  // Asegúrate de que esta propiedad esté correctamente definida como @Input()
  @Input() categories: { id: number; name: string }[] = [];
  @Output() submitForm = new EventEmitter<void>();

  onSubmit() {
    this.submitForm.emit();
  }
}

