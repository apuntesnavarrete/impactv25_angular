import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AsistenciasService {
  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  // Asistencias globales (todos los datos)
  getAsistenciasGlobal(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/goleo/asistencias`);
  }

  // Asistencias por torneo (idTorneo)
  getAsistenciasByTorneo(idTorneo: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/goleo/asistencias/${idTorneo}`);
  }

  // Top asistencias del mes (año y mes)
  getTopAsistenciasDelMes(anio: number, mes: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/goleo/asistencias-mes/${anio}/${mes}`);
  }

  // Top asistencias del mes por liga
  getTopAsistenciasDelMesPorLiga(anio: number, mes: number, liga: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/goleo/asistencias-mes/${anio}/${mes}/liga/${liga}`);
  }
}
