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

   getGoleadoresByTorneo(idTorneo: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/goleo/${idTorneo}`);
  }
}
