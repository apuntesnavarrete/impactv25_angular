import { Component, Input } from '@angular/core';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-btn-descargar',
    standalone: true,   // ✅ solo si estás usando componentes standalone

  imports: [],
  templateUrl: './btn-descargar.component.html',
  styleUrl: './btn-descargar.component.css'
})
export class BtnDescargarComponent {
 @Input() targetId!: string; // El ID del div que quieres capturar
  @Input() nombreArchivo: string = 'descarga';
descargar() {
    const element = document.getElementById(this.targetId);
    if (!element) return;

   html2canvas(element, { useCORS: true }).then(canvas => {
     const link = document.createElement('a');
     link.download = `${this.nombreArchivo}.png`;
     link.href = canvas.toDataURL();
     link.click();
});
  }
}


