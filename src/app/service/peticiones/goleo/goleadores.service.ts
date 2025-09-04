import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';

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
}
