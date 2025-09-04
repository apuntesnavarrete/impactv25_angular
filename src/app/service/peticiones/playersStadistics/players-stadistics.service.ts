import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlayersStadisticsService {
  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  // Enviar estadística de jugadores (ya lo estás usando)
  sendPlayerStats(data: any[]): Observable<any> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.post(`${this.baseUrl}/PlayerStatistics`, data, { headers });
  }

  // ✅ Obtener TODAS las estadísticas
  getAllPlayerStats(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/PlayerStatistics`);
  }

  // ✅ Obtener estadísticas por torneo (filtrado)
  getPlayerStatsByTournamentId(tournamentId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/PlayerStatistics/tournament/${tournamentId}`);
  }

  // ✅ Obtener estadísticas por ID de partido
getPlayerStatsByMatchId(idPartido: number): Observable<any[]> {
  return this.http.get<any[]>(`${this.baseUrl}/PlayerStatistics/partido/${idPartido}`);
}
}