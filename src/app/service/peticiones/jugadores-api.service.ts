import { HttpClient } from '@angular/common/http';
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

}
