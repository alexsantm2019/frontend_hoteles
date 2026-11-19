import { Injectable, inject, signal, PLATFORM_ID } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { isPlatformBrowser } from "@angular/common";
import { Observable, tap } from "rxjs";
import { environment } from "../../environments/environment";
import { Configuracion } from '../../models/configuracion.models';
import { CATALOGOS } from '../../config/catalogos.config';

@Injectable({ providedIn: 'root' })
export class ConfiguracionService {
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);
  private apiUrl = `${environment.apiUrl}/core/configuracion`;

  // Añadimos el parámetro opcional catalogoId
  obtenerConfiguraciones(catalogoId?: CATALOGOS): Observable<Configuracion[]> {
    let url = `${this.apiUrl}/`;
    if (catalogoId) {
      url += `?catalogo=${catalogoId}`;
    }
    return this.http.get<Configuracion[]>(url);
  }

}
