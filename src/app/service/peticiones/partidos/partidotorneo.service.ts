import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PartidotorneoService {

  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }

  getMatchesByTorneoId(idTorneo: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/matches/tournament/${idTorneo}`);
  }

 getMatch(idMatch: number): Observable<any> {
  return this.http.get<any>(`${this.baseUrl}/matches/${idMatch}`);
}

  createMatch(data: any): Observable<any> {
  const token = localStorage.getItem('token');
  const headers = {
    Authorization: `Bearer ${token}`
  };

  return this.http.post(`${this.baseUrl}/matches`, data, { headers });
}
}

