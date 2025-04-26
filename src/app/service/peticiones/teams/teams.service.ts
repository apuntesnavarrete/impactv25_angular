import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EquiposApiService {
  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  getTeams(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/teams`);
  }

  getTeamById(id: string, token: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get(`${this.baseUrl}/teams/${id}`, { headers });
  }

  addTeam(team: FormData, token: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
      // NO agregar Content-Type aquí si usas FormData
    });
  
    return this.http.post(`${this.baseUrl}/teams`, team, { headers });
  }

  updateTeam(id: string, team: any, token: string): Observable<any> {
    let headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    if (!(team instanceof FormData)) {
      headers = headers.set('Content-Type', 'application/json');
    }

    return this.http.put(`${this.baseUrl}/teams/${id}`, team, { headers });
  }
}