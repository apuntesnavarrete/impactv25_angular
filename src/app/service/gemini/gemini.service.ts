import { Injectable } from '@angular/core';
// 1. CAMBIO: Cambiamos 'GoogleGenAI' por 'GoogleGenerativeAI'
import { GoogleGenerativeAI } from '@google/generative-ai'; 
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GeminiService {
  // 2. CAMBIO: Usamos la clase correcta para inicializar el objeto
  private ai = new GoogleGenerativeAI(environment.geminiApiKey);

  private fileToGenerativePart(file: File): Promise<any> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Data = (reader.result as string).split(',')[1];
        resolve({
          inlineData: { data: base64Data, mimeType: file.type },
        });
      };
      reader.onerror = error => reject(error);
      reader.readAsDataURL(file);
    });
  }

async procesarCedulaConImagen(imagenFile: File, baseDatosOficial: any): Promise<any> {
    const model = this.ai.getGenerativeModel({ model: "gemini-2.5-flash" });
    const imagenData = await this.fileToGenerativePart(imagenFile);

    const prompt = `
      Eres un sistema automatizado experto para el control de ligas de fútbol. 
      Compara la imagen de la cédula manuscrita (hoja de anotación del partido) con este JSON de la Base de Datos Oficial:
      ${JSON.stringify(baseDatosOficial)}

      INSTRUCCIONES DE PROCESAMIENTO:
      1. Analiza los nombres y dorsales escritos a mano en la cédula para cada equipo (${baseDatosOficial.nombreLocal} y ${baseDatosOficial.nombreVisitante}).
      2. Compáralos con los jugadores de la lista oficial (rosterLocal y rosterVisitante).
      3. Si un jugador aparece en la cédula, márcalo en el JSON de respuesta con "asistio": true. Si no aparece o está tachado, "asistio": false.
      4. Cuenta los goles anotados por cada jugador según las marcas o números en la cédula.
      5. Identifica errores humanos comunes del árbitro: por ejemplo, si en la tabla de goles anotó el número de ID del sistema (como el 61) en lugar de un número de dorsal válido, o si anotó un dorsal que no existe. Agrega estos detalles en el arreglo de "discrepancias".

     Devuelve ESTRICTAMENTE un objeto JSON con el siguiente formato, sin texto extra, código markdown o saludos fuera del JSON:
      {
        "discrepanciasLocal": ["Errores específicos del equipo local"],
        "discrepanciasVisitante": ["Errores específicos del equipo visitante"],
        "discrepanciasGenerales": ["Errores del partido en general, si los hay"],
        "jugadoresLocal": [
          { "id": 123, "asistio": true, "goles": 2 }
        ],
        "jugadoresVisitante": [
          { "id": 456, "asistio": false, "goles": 0 }
        ]
      }
    `;

    const result = await model.generateContent([prompt, imagenData]);
    // Limpiamos cualquier formato markdown que Gemini suela poner
    const jsonLimpio = result.response.text().replace(/```json|```/g, '').trim();
    return JSON.parse(jsonLimpio);
  }
}