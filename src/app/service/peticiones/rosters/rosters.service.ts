import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RostersService {
  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }


  getRosters(): Observable<any> {
      return this.http.get<any>(`${this.baseUrl}/rosters`);
    }

  getRostersByIdTournament(id: string): Observable<any> {
    const headers = new HttpHeaders();

    return this.http.get(`${this.baseUrl}/rosters/tournament/${id}`, { headers });
  }


  addRoster(data: any): Observable<any> {
  const token = localStorage.getItem('token');
  const headers = {
    Authorization: `Bearer ${token}`
  };

  return this.http.post(`${this.baseUrl}/rosters`, data, { headers });
}


}
