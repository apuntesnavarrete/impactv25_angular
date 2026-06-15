import { Component, Input } from '@angular/core';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-btn-descargar',
  standalone: true, // ✅ Manteniendo tu configuración standalone
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

    // --- CONFIGURACIÓN MEJORADA ---
    // Agregamos 'scale: 3' para triplicar los píxeles y darte la máxima resolución
    const opciones = {
      useCORS: true, 
      scale: 3, 
      backgroundColor: null
    };

    html2canvas(element, opciones).then(canvas => {
      const link = document.createElement('a');
      link.download = `${this.nombreArchivo}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    });
  }
}


