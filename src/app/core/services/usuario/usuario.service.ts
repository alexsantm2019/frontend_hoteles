// src/app/core/services/usuario.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
// import { Usuario } from '../../models/usuario.models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/usuarios`;

  // getUsuarios(): Observable<Usuario[]> {
  //   return this.http.get<Usuario[]>(this.apiUrl);
  // }

  obtenerRoles(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/roles/`);
  }

  obtenerUsuarios(empresaId: number): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}/equipo/?empresa_id=${empresaId}`,
    );
  }

  crearUsuario(data: any, empresaId: number): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/equipo/?empresa_id=${empresaId}`,
      data,
    );
  }

  actualizarUsuario(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/equipo/${id}/`, data);
  }

  cambiarEstadoUsuario(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/equipo/${id}/toggle_active/`, {});
  }

  eliminarUsuario(id: number): Observable<any> {
    // Soft delete (DRF lo maneja como DELETE si el modelo hereda de BaseModel)
    return this.http.delete(`${this.apiUrl}/equipo/${id}/`);
  }

  obtenerHotelesEmpresa(empresaId: number): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}/empresas/${empresaId}/hoteles/`,
    );
  }
}
