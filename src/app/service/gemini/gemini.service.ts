import { Injectable } from '@angular/core';
import { GoogleGenerativeAI } from '@google/generative-ai'; 
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GeminiService {
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
      Analiza la imagen de la cédula del partido y compárala con este JSON de la Base de Datos Oficial para identificar a los jugadores:
      ${JSON.stringify(baseDatosOficial)}

      REGLA CRÍTICA DE DISEÑO DE CÉDULA:
      Identifica visualmente cuál de los dos formatos de cédula se está usando en la imagen y aplica sus reglas:
      
      - FORMATO A (Nombres Impresos): Los nombres e IDs ya vienen impresos en celdas fijas. La asistencia se marca manualmente en el cuadro al lado del ID. 
        * Una palomita ("✓") significa "asistio": true.
        * Un cuadro vacío o con una "X" significa "asistio": false.
        * Si hay filas vacías al final con nombres e información escrita totalmente a mano, son altas manuales. Búscalos en la lista oficial por su nombre o dorsal.
        
      - FORMATO B (Totalmente Manuscrito): Los nombres y dorsales están escritos a mano desde cero en filas vacías.
        * Si el nombre del jugador aparece escrito, significa "asistio": true. Si no aparece, "asistio": false.

      INSTRUCCIONES DE PROCESAMIENTO GENERAL:
      1. Determina la asistencia para cada equipo (${baseDatosOficial.nombreLocal} y ${baseDatosOficial.nombreVisitante}) usando las reglas del formato detectado.
      2. Asigna la asistencia ("asistio": true/false) mapeando los jugadores encontrados con sus respectivos IDs de la lista oficial (rosterLocal y rosterVisitante).
      3. Cuenta los goles anotados por cada jugador según la cuadrícula o sección de goles en la cédula. Relaciona los dorsales anotados en la cuadrícula de goles con los IDs de los jugadores.
      4. Identifica errores humanos comunes del árbitro: por ejemplo, si en la tabla de goles anotó un número de ID del sistema en lugar de un número de dorsal válido, si anotó un dorsal que no existe en el roster, o marcas confusas. Agrega estos detalles en el arreglo de "discrepancias".

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

      REGLAS DE ESTRUCTURA AND CONTENIDO (SÍGUELAS ESTRICTAMENTE):

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

  // ==========================================
  // NUEVO MÉTODO: PROCESAR ROL DE JUEGOS DESDE IMAGEN
  // ==========================================
  async procesarRolJuegos(imagenFile: File, listaEquiposLogos: any[]): Promise<any> {
    const model = this.ai.getGenerativeModel({ model: "gemini-2.5-flash" });
    const imagenData = await this.fileToGenerativePart(imagenFile);

  const prompt = `
      Eres un asistente experto en digitalización de datos para ligas de fútbol. 
      Tu tarea es leer una imagen manuscrita con el rol de juegos de la semana (dividido por días, canchas y horarios) y generar un JSON limpio y estructurado.

      Para garantizar la precisión de los datos, DEBES mapear y validar cada equipo que encuentres en la imagen usando la siguiente lista de referencia oficial (la cual contiene nombre, logo e id_equipo):
      ${JSON.stringify(listaEquiposLogos)}

      REGLAS DE PROCESAMIENTO Y MAPEADO:
      1. ANALIZAR ESTRUCTURA VIRTUAL: Identifica los días (Lunes, Martes, Miércoles, Jueves, Viernes, etc.), las canchas (Cancha 1, Cancha 2) y los horarios de cada partido.
      2. MAPEO DE EQUIPOS: Busca los nombres manuscritos en la lista oficial. Reemplázalos por el "nombreEquipo" exacto, añade su "logo" y OBLIGATORIAMENTE incluye su "id_equipo".
      3. TRADUCCIÓN DE CATEGORÍAS: Convierte la categoría leída de la imagen al formato simplificado del cliente:
         - "sub 16", "sub 19", "libre" o "mixto".

      ESTRUCTURA DEL JSON REQUERIDA (INCLUYENDO IDs):
      Devuelve ESTRICTAMENTE un objeto JSON con la subdivisión por Día -> Cancha. No incluyas texto explicativo ni formato markdown (\`\`\`json):

      {
        "Lunes": {
          "Cancha 1": [
            {
              "categoria": "sub 16",
              "categoria_id: "id de la categoria"
              "local": "NombreExacto",
              "localId": "id_del_equipo_aqui",
              "localLogo": "archivo_logo.png",
              "visitante": "NombreExacto",
              "visitanteId": "id_del_equipo_aqui",
              "visitanteLogo": "archivo_logo.png",
              "horario": "7:20pm"
            }
          ],
          "Cancha 2": []
        }
      }

      Asegúrate de procesar todos los datos visibles en la imagen de manera rigurosa.
    `;

    const result = await model.generateContent([prompt, imagenData]);
    const jsonLimpio = result.response.text().replace(/```json|```/g, '').trim();

    return JSON.parse(jsonLimpio);
  }
}
