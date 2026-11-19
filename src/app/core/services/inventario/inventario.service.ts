import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Producto, Consumo } from '../../models/inventario.models';

@Injectable({ providedIn: 'root' })
export class InventarioService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/inventario`;

  // Productos
  obtenerProductos(hotelId: number): Observable<Producto[]> {
    return this.http.get<Producto[]>(
      `${this.apiUrl}/productos/?hotel_id=${hotelId}`,
    );
  }
  crearProducto(hotelId: number, data: any): Observable<Producto> {
    return this.http.post<Producto>(
      `${this.apiUrl}/productos/?hotel_id=${hotelId}`,
      data,
    );
  }
  actualizarProducto(id: number, data: any): Observable<Producto> {
    return this.http.put<Producto>(`${this.apiUrl}/productos/${id}/`, data);
  }
  eliminarProducto(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/productos/${id}/`);
  }

  // Consumos
  registrarConsumo(data: any): Observable<Consumo> {
    return this.http.post<Consumo>(`${this.apiUrl}/consumos/`, data);
  }
  eliminarConsumo(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/consumos/${id}/`);
  }

  ingresarStock(productoId: number, cantidad: number): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/productos/${productoId}/ingresar_stock/`,
      { cantidad },
    );
  }

  transferirHabitacion(
    productoId: number,
    cantidad: number,
    habitacionId: number,
  ): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/productos/${productoId}/transferir_habitacion/`,
      { cantidad, habitacion_id: habitacionId },
    );
  }

  obtenerStock(hotelId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/stock/?hotel_id=${hotelId}`);
  }
  obtenerStockHabitacion(habitacionId: number): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}/stock/por_habitacion/?habitacion_id=${habitacionId}`,
    );
  }
}
