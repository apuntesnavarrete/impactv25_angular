import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LigasService {
  private apiUrl = `${environment.baseUrl}/leagues`;

  constructor(private http: HttpClient) {}

  getAllLeagues(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  getLeagueById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  addLeague(data: FormData, token: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.post(this.apiUrl, data, { headers });
  }

  updateLeague(id: number, data: FormData, token: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.patch(`${this.apiUrl}/${id}`, data, { headers });
  }

  deleteLeague(id: number, token: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.delete(`${this.apiUrl}/${id}`, { headers });
  }
}