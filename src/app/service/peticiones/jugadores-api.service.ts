import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JugadoresApiService {
  private baseUrl = 'http://192.168.0.10:8080/api/v1';


  constructor(private http: HttpClient) {
  }  

  getPlayers(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/participants`);
  }

}
