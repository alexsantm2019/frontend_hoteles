// catalogos.ts
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CatalogosService } from '../services/_catalogos/catalogos.service'
import { CatalogosInterface } from '../models/_catalogos.models';


@Injectable({
  providedIn: 'root'
})
export class CatalogoHelper {
  private catalogosService = inject(CatalogosService);
  constructor() { }

  getCatalogo(id: number): Observable<CatalogosInterface[]> {
    return this.catalogosService.getCatalogoByGrupo(id);
  }
}