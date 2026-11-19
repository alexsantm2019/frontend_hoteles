import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Pago } from '../../models/pago.models';

@Injectable({ providedIn: 'root' })
export class PagosService {
  private http = inject(HttpClient);
  // Apunta a la nueva app de Django 'pagos'
  private apiUrl = `${environment.apiUrl}/pagos`;

  // Registrar un nuevo pago
  registrarPago(data: any): Observable<Pago> {
    return this.http.post<Pago>(`${this.apiUrl}/pagos/`, data);
  }

  // Obtener los pagos de una reserva específica (por si lo necesitas para un historial)
  obtenerPagosReserva(reservaId: number): Observable<Pago[]> {
    return this.http.get<Pago[]>(
      `${this.apiUrl}/pagos/?reserva_id=${reservaId}`,
    );
  }
}
