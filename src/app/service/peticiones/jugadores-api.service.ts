import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class JugadoresApiService {
  private baseUrl = environment.baseUrl;


  constructor(private http: HttpClient) {
  }  

  getPlayers(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/participants`);
  }

  getPlayerById(id: string): Observable<any> {
    const headers = new HttpHeaders({
    });
  
    return this.http.get(`${this.baseUrl}/participants/${id}`, { headers });
  }

  addPlayers(jugador: any, token: string): Observable<any> {
  
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.post(`${this.baseUrl}/participants`, jugador, { headers });
  }

  updatePlayer(id: string, jugador: any, token: string): Observable<any> {
    let headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  
    // Si es FormData, no agregar Content-Type
    if (!(jugador instanceof FormData)) {
      headers = headers.set('Content-Type', 'application/json');
    }
  
    return this.http.put(`${this.baseUrl}/participants/${id}`, jugador, { headers });
  }
}
