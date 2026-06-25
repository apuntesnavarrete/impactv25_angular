import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-filaroll',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './filaroll.component.html',
  styleUrl: './filaroll.component.css'
})
export class FilarollComponent {
  // Aquí recibimos el objeto del partido desde el padre
  @Input() partido: any; 

  @Input() fechaRol: string = '';
}
