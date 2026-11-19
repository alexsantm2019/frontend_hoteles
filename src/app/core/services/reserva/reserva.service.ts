import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Reserva, Huesped } from '../../models/reserva.models';

@Injectable({ providedIn: 'root' })
export class ReservaService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/reservas`;

  obtenerReservas(hotelId: number): Observable<Reserva[]> {
    return this.http.get<Reserva[]>(
      `${this.apiUrl}/reservas/?hotel_id=${hotelId}`,
    );
  }

  crearReserva(hotelId: number, data: any): Observable<Reserva> {
    return this.http.post<Reserva>(
      `${this.apiUrl}/reservas/?hotel_id=${hotelId}`,
      data,
    );
  }

  obtenerHuespedes(hotelId: number): Observable<Huesped[]> {
    return this.http.get<Huesped[]>(
      `${this.apiUrl}/huespedes/?hotel_id=${hotelId}`,
    );
  }

  crearHuesped(hotelId: number, data: any): Observable<Huesped> {
    return this.http.post<Huesped>(
      `${this.apiUrl}/huespedes/?hotel_id=${hotelId}`,
      data,
    );
  }

  actualizarHuesped(
    hotelId: number,
    id: number,
    data: any,
  ): Observable<Huesped> {
    return this.http.put<Huesped>(
      `${this.apiUrl}/huespedes/${id}/?hotel_id=${hotelId}`,
      data,
    );
  }

  eliminarHuesped(hotelId: number, id: number): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/huespedes/${id}/?hotel_id=${hotelId}`,
    );
  }
  obtenerHabitacionesDisponibles(
    hotelId: number,
    entrada: string,
    salida: string,
  ): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}/disponibilidad/?hotel_id=${hotelId}&entrada=${entrada}&salida=${salida}`,
    );
  }

  cambiarEstadoReserva(
    hotelId: number,
    id: number,
    nuevoEstado: string,
  ): Observable<Reserva> {
    // Enviamos el hotel_id en la URL
    return this.http.post<Reserva>(
      `${this.apiUrl}/reservas/${id}/cambiar_estado/?hotel_id=${hotelId}`,
      { estado: nuevoEstado },
    );
  }

  descargarPDF(reservaId: number): Observable<Blob> {
    return this.http.get(
      `${this.apiUrl}/reservas/${reservaId}/descargar_pdf/`,
      {
        responseType: 'blob',
      },
    );
  }
}
