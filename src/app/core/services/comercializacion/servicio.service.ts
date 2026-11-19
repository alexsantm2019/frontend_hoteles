import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Servicio, DetalleServicioReserva } from '../../models/servicio.models';

@Injectable({ providedIn: 'root' })
export class ServicioService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/comercializacion`;

  obtenerServicios(hotelId: number): Observable<Servicio[]> {
    return this.http.get<Servicio[]>(
      `${this.apiUrl}/servicios/?hotel_id=${hotelId}`,
    );
  }

  crearServicio(hotelId: number, data: any): Observable<Servicio> {
    return this.http.post<Servicio>(
      `${this.apiUrl}/servicios/?hotel_id=${hotelId}`,
      data,
    );
  }

  cargarServicioReserva(data: any): Observable<DetalleServicioReserva> {
    return this.http.post<DetalleServicioReserva>(
      `${this.apiUrl}/consumos/`,
      data,
    );
  }

  obtenerConsumosReserva(
    reservaId: number,
  ): Observable<DetalleServicioReserva[]> {
    return this.http.get<DetalleServicioReserva[]>(
      `${this.apiUrl}/consumos/?reserva_id=${reservaId}`,
    );
  }
  actualizarServicio(id: number, data: any): Observable<Servicio> {
    return this.http.put<Servicio>(`${this.apiUrl}/servicios/${id}/`, data);
  }

  eliminarServicio(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/servicios/${id}/`);
  }

  eliminarConsumo(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/consumos/${id}/`);
  }
}
