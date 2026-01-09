import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GoleadoresService {
  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  // Goleadores por torneo completo
  getGoleadoresByTorneo(idTorneo: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/goleo/${idTorneo}`);
  }

  // Goleadores del mes por liga (nuevo)
  getGoleadoresMesPorLiga(anio: number, mes: number, liga: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/goleo/goleadores-mes/${anio}/${mes}/liga/${liga}`);
  }

  // Goleadores del mes por torneo (opcional)
  getGoleadoresMesPorTorneo(anio: number, mes: number, idTorneo: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/goleo/goleadores-mes/${anio}/${mes}/${idTorneo}`);
  }

  // Goleadores globales (opcional)
  getGoleadoresGlobal(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/goleo`);
  }

  getGoleadoresDelMes(anio: number, mes: number): Observable<any[]> {
  return this.http.get<any[]>(`${this.baseUrl}/goleo/goleador-mes/${anio}/${mes}`);
}


getTop20GoleadoresAnio(anio: number): Observable<any[]> {
  return this.http
    .get<any[]>(`${this.baseUrl}/PlayerStatistics`)
    .pipe(
      map(stats => {
        // 1. Filter by year
        const filtered = stats.filter(s => {
          const matchDate = new Date(s.matches.date);
          return matchDate.getFullYear() === anio;
        });

        // 2. Group only by player
        const goleadoresMap: Record<number, any> = {};

        filtered.forEach(s => {
          const playerId = s.participants.id;

          if (!goleadoresMap[playerId]) {
            goleadoresMap[playerId] = {
              playerId,
              name: s.participants.name,
              goals: 0
            };
          }

          // 3. Accumulate goals
          goleadoresMap[playerId].goals += s.annotations || 0;
        });

        // 4. Sort and return top 20
        return Object.values(goleadoresMap)
          .sort((a: any, b: any) => b.goals - a.goals)
          .slice(0, 20);
      })
    );
}

getTop20AsistenciasAnio(anio: number): Observable<any[]> {
  return this.http
    .get<any[]>(`${this.baseUrl}/PlayerStatistics`)
    .pipe(
      map(stats => {
        // 1. Filter by year
        const filtered = stats.filter(s => {
          const matchDate = new Date(s.matches.date);
          return matchDate.getFullYear() === anio;
        });

        // 2. Group by player
        const asistenciasMap: Record<number, any> = {};

        filtered.forEach(s => {
          // Only count records that represent an assist
          if (s.attendance !== true) return;

          const playerId = s.participants.id;

          if (!asistenciasMap[playerId]) {
            asistenciasMap[playerId] = {
              playerId,
              name: s.participants.name,
              assists: 0
            };
          }

          // 3. Accumulate assists
          asistenciasMap[playerId].assists += 1;
        });

        // 4. Sort and return top 20
        return Object.values(asistenciasMap)
          .sort((a: any, b: any) => b.assists - a.assists)
          .slice(0, 20);
      })
    );
}


}
