import { Injectable, inject, signal, PLATFORM_ID } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { isPlatformBrowser } from "@angular/common";
import { Observable, tap } from "rxjs";
import { environment } from "../../environments/environment";
import { Habitacion, Hotel, Piso } from "../../models/empresa.models";
import { Edificio } from '../../models/empresa.models';

@Injectable({ providedIn: 'root' })
export class EmpresaService {
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);
  private apiUrl = `${environment.apiUrl}/empresas`;

  // Signal para el hotel activo
  hotelActivo = signal<Hotel | null>(null);

  // Signal para la lista de hoteles disponibles
  hotelesDisponibles = signal<Hotel[]>([]);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      const savedHotel = localStorage.getItem('hotelActivo');
      if (savedHotel) {
        this.hotelActivo.set(JSON.parse(savedHotel));
      }
    }
  }

  cargarMisHoteles(): Observable<Hotel[]> {
    return this.http.get<Hotel[]>(`${this.apiUrl}/mis-hoteles/`).pipe(
      tap((hoteles) => {
        this.hotelesDisponibles.set(hoteles);
        if (hoteles.length > 0 && !this.hotelActivo()) {
          this.seleccionarHotel(hoteles[0]);
        }
      }),
    );
  }

  seleccionarHotel(hotel: Hotel): void {
    this.hotelActivo.set(hotel);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('hotelActivo', JSON.stringify(hotel));
    }
  }

  limpiarContexto(): void {
    this.hotelActivo.set(null);
    this.hotelesDisponibles.set([]);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('hotelActivo');
    }
  }

  obtenerEstructuraHotel(hotelId: number): Observable<Edificio[]> {
    return this.http.get<Edificio[]>(
      `${this.apiUrl}/hoteles/${hotelId}/estructura/`,
    );
  }

  crearEdificio(data: { nombre: string; hotel: number }): Observable<Edificio> {
    return this.http.post<Edificio>(`${this.apiUrl}/edificios/`, data);
  }

  actualizarEdificio(
    id: number,
    data: { nombre: string; hotel: number },
  ): Observable<Edificio> {
    return this.http.put<Edificio>(`${this.apiUrl}/edificios/${id}/`, data);
  }

  eliminarEdificio(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/edificios/${id}/`);
  }

  obtenerEdificios(hotelId: number): Observable<Edificio[]> {
    return this.http.get<Edificio[]>(
      `${this.apiUrl}/edificios/?hotel_id=${hotelId}`,
    );
  }

  // PISOS
  crearPiso(data: { numero: string; edificio: number }): Observable<Piso> {
    return this.http.post<Piso>(`${this.apiUrl}/pisos/`, data);
  }

  // HABITACIONES
  crearHabitacion(data: any): Observable<Habitacion> {
    return this.http.post<Habitacion>(`${this.apiUrl}/habitaciones/`, data);
  }

  actualizarHabitacion(id: number, data: any): Observable<Habitacion> {
    return this.http.put<Habitacion>(
      `${this.apiUrl}/habitaciones/${id}/`,
      data,
    );
  }

  eliminarHabitacion(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/habitaciones/${id}/`);
  }

  cambiarEstadoHabitacion(habitacionId: number, nuevoEstado: string) {
    return this.http.patch(
      `${this.apiUrl}/habitaciones/${habitacionId}/cambiar-estado/`,
      {
        estado_limpieza: nuevoEstado,
      },
    );
  }
  obtenerHabitacionesHotel(hotelId: number): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}/hoteles/${hotelId}/habitaciones/`,
    );
  }

  // ADMINISTRADOR DE EMPRESAS

  // Para obtener las empresas (SaaS Admin)
  obtenerEmpresasAdmin(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/admin/empresas/`);
  }

  // Para crear una empresa
  crearEmpresa(data: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/admin/empresas/`, data);
  }

  // NUEVOS MÉTODOS
  actualizarEmpresa(id: number, data: any): Observable<any> {
    return this.http.put(`${environment.apiUrl}/admin/empresas/${id}/`, data);
  }

  eliminarEmpresa(id: number): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/admin/empresas/${id}/`);
  }

  // Hoteles (Admin)
  obtenerHotelesEmpresa(empresaId: number): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}/${empresaId}/hoteles/`,
    );
  }

  crearHotelAdmin(data: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/admin/hoteles/`, data);
  }

  actualizarHotelAdmin(id: number, data: any): Observable<any> {
    return this.http.put(`${environment.apiUrl}/admin/hoteles/${id}/`, data);
  }

  eliminarHotelAdmin(id: number): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/admin/hoteles/${id}/`);
  }
}
