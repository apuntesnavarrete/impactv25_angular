import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RollService {
  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }

  getRollByIdTournament(id: number): Observable<any> {
      const headers = new HttpHeaders();
  
      return this.http.get(`${this.baseUrl}/roll/${id}`, { headers });
    }
}
