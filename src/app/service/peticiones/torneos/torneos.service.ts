import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TournamentsApiService {
  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  getTournaments(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/tournaments`);
  }

  getTournamentById(id: string, token: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get(`${this.baseUrl}/tournaments/${id}`, { headers });
  }

  /** 🔍 Nueva función para obtener el ID del torneo según liga y categoría */
  getTournamentId(liga: string, torneo: string): Observable<number | null> {
    return this.getTournaments().pipe(
      map((data: any[]) => {
        const filtered = data.filter(item =>
          item.leagues?.Alias === liga.toUpperCase() &&
          item.categories?.categorias?.toUpperCase() === torneo.toUpperCase()
        );

        const sorted = filtered.sort((b, a) => a.idName.localeCompare(b.idName));

        return sorted.length > 0 ? sorted[0].id : null;
      })
    );
  }



  addTournament(tournament: any, token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });
  console.log(tournament)
    return this.http.post(`${this.baseUrl}/tournaments`, tournament, { headers });
  }

  updateTournament(id: string, tournament: any, token: string): Observable<any> {
    let headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    if (!(tournament instanceof FormData)) {
      headers = headers.set('Content-Type', 'application/json');
    }

    return this.http.put(`${this.baseUrl}/tournaments/${id}`, tournament, { headers });
  }

  getUniqueCategoriesByLeague(alias: string) {
  return this.http.get<string[]>(`${this.baseUrl}/tournaments/unique-categories/${alias}`);
}
}
