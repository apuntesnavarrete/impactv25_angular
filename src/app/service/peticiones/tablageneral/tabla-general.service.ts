import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TablaGeneralService {
  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  getTablaGeneralById(idtorneo: number) {
    return this.http.get(`${this.baseUrl}/tablageneral/${idtorneo}`);
  }
}
