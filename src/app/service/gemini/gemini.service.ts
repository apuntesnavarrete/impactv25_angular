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


  // ==========================================
  // NUEVO MÉTODO: GENERAR NARRATIVA DINÁMICA
  // ==========================================
  async generarNarrativaPartido(
    nombreLiga: string, 
    partidoActual: any, 
    historialEquipos: any, 
    tablaGeneral: any
  ): Promise<string> {
    
    const model = this.ai.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      Actúa como un cronista deportivo analítico y entusiasta para la liga de fútbol "${nombreLiga}". Tu objetivo es escribir una crónica que aporte valor real, enfocándote en lo que el usuario NO ve en la imagen: la tabla general, las rachas y el momento en que llegan los equipos.

      Usa un lenguaje sencillo, claro y estructura el texto para que sea muy fácil de leer rápido (scannability).

      Te proporcionaré tres fuentes de datos en formato JSON:
      1. DATOS DEL PARTIDO ACTUAL:
      ${JSON.stringify(partidoActual, null, 2)}

      2. HISTORIAL DE PARTIDOS ANTERIORES DE AMBOS EQUIPOS:
      ${JSON.stringify(historialEquipos, null, 2)}

      3. JSON DE LA TABLA GENERAL ACTUAL:
      ${JSON.stringify(tablaGeneral, null, 2)}

      REGLAS DE ESTRUCTURA Y CONTENIDO (SÍGUELAS ESTRICTAMENTE):

      1. ENCABEZADO PERSONALIZADO Y ANOTADORES:
         - TÍTULO UNICO: No uses un título genérico. Analiza las rachas de los equipos con este resultado y crea un encabezado llamativo con emojis basado en lo que pasó (Ejemplos: "⚡ ¡EL LÍDER SIGUE IMPARABLE EN LA CANCHA!", "🔥 ¡CORTAN LA RACHA NEGATIVA CON UN TRIUNFO VALIOSO!", "🤝 DUELO MUY PAREJO QUE TERMINA EN EMPATE").
         - Ve directo al grano: No repitas la fecha, jornada, categoría ni el marcador en el texto principal de forma aburrida. 
         - Primer párrafo: menciona de forma directa y resumida quiénes fueron los ANOTADORES del encuentro si vienen en los datos.
         - Nota de juego: No utilices los términos "local" o "visitante", ya que todos los equipos juegan en la misma sede/estadio. Refiérete a ellos simplemente por su nombre o como "ambos conjuntos".

      2. SECCIÓN DE ANÁLISIS (Usa la línea divisoria ---):
         - Usa el título exactamente así: 📉 ANÁLISIS DE RACHAS Y MOMENTO DE LOS EQUIPOS
         - Para el Primer Equipo: Di en qué lugar de la tabla se encuentra o cuántos puntos tiene usando el JSON de la tabla. Analiza su racha sumando este último resultado con su historial (ej. "con este resultado hilan X partidos sin ganar/perder", o "cortan una racha de...").
         - Para el Segundo Equipo: Haz el mismo análisis de posición, puntos y racha alcanzada con este juego.

      3. MINI TABLA DE POSICIONES AL MOMENTO (Usa la línea divisoria ---):
         - Usa el título exactamente así: 📊 ASÍ SE MUEVE LA TABLA GENERAL
         - Crea una lista pequeña que muestre la zona de la tabla donde están los involucrados. 
         - REGLA DE FILTRADO: Busca la posición actual de ambos equipos en el JSON de la Tabla General. Para cada uno de ellos, muestra al equipo que va un puesto ARRIBA, el puesto del EQUIPO PROTAGONISTA en negritas, y al equipo que va un puesto ABAJO. 
         - Formato visual de la mini tabla (ejemplo):
           • 3° Equipo X — 15 pts
           • **4° [Nombre del Equipo A] — 13 pts** (Resaltado en negritas)
           • 5° Equipo Y — 12 pts
           (Deja un espacio y haz lo mismo para el Equipo B si están en zonas muy separadas de la tabla).

      4. CIERRE DEL REPORTE:
         - Incluye siempre estas dos viñetas finales de forma obligatoria al final:
           📢 Aviso Especial: Por favor, revisen que los nombres y los goles anotados estén bien. Si ven algún error, favor de mandar mns a la pagina.
           📋 Nota General: Recuerden registrarse con su nombre completo para no tener complicaciones con sus estadísticas individuales.
      
      5. IDIOMA: Responde siempre en español. No agregues formatos de código como \`\`\` o textos extras fuera de la crónica deportiva.
    `;

    const result = await model.generateContent(prompt);
    return result.response.text();
  }
}