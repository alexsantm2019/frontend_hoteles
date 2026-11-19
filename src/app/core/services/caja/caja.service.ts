import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { TurnoCaja } from '../../models/caja.models';

@Injectable({ providedIn: 'root' })
export class CajaService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/caja`;

  obtenerTurnos(hotelId: number): Observable<TurnoCaja[]> {
    return this.http.get<TurnoCaja[]>(
      `${this.apiUrl}/turnos/?hotel_id=${hotelId}`,
    );
  }

  abrirCaja(hotelId: number, saldoInicial: number): Observable<TurnoCaja> {
    return this.http.post<TurnoCaja>(
      `${this.apiUrl}/turnos/?hotel_id=${hotelId}`,
      { saldo_inicial: saldoInicial },
    );
  }

  cerrarCaja(
    turnoId: number,
    saldoReal: number,
    observaciones: string,
  ): Observable<TurnoCaja> {
    // Enviamos el hotel_id (aunque el backend ya no lo necesite para esta acción)
    return this.http.post<TurnoCaja>(
      `${this.apiUrl}/turnos/${turnoId}/cerrar_caja/`,
      {
        saldo_final_real: saldoReal,
        observaciones,
      },
    );
  }
}
