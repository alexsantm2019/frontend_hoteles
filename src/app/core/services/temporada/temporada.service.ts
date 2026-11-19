import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Temporada } from '../../models/temporada.models';

@Injectable({ providedIn: 'root' })
export class TemporadaService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/temporadas`;

  obtenerTemporadas(hotelId: number): Observable<Temporada[]> {
    return this.http.get<Temporada[]>(
      `${this.apiUrl}/temporadas/?hotel_id=${hotelId}`,
    );
  }
  crearTemporada(hotelId: number, data: any): Observable<Temporada> {
    return this.http.post<Temporada>(
      `${this.apiUrl}/temporadas/?hotel_id=${hotelId}`,
      data,
    );
  }
  actualizarTemporada(id: number, data: any): Observable<Temporada> {
    return this.http.put<Temporada>(`${this.apiUrl}/temporadas/${id}/`, data);
  }
  eliminarTemporada(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/temporadas/${id}/`);
  }
}
