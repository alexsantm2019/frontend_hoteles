// src/app/core/pipes/filter-by.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterBy',
  standalone: true,
})
export class FilterByPipe implements PipeTransform {
  /**
   * Filtra un arreglo de objetos por uno o múltiples campos
   * @param items - Arreglo de objetos a filtrar
   * @param term - Término de búsqueda
   * @param fields - Campo(s) por los que buscar (si no se especifica, busca en todos los campos string)
   * @param exactMatch - Si debe ser coincidencia exacta (default: false)
   */
  transform(
    items: any[],
    term: string,
    fields?: string | string[],
    exactMatch: boolean = false,
  ): any[] {
    // Si no hay items o el término está vacío, devolver todo
    if (!items || !term) {
      return items;
    }

    const searchTerm = term.toLowerCase().trim();

    // Si no se especifican campos, buscar en todos los campos del objeto
    if (!fields) {
      return items.filter((item) => {
        return this.searchInAllFields(item, searchTerm, exactMatch);
      });
    }

    // Si se especifica un solo campo como string
    if (typeof fields === 'string') {
      return items.filter((item) => {
        return this.searchInField(item, fields, searchTerm, exactMatch);
      });
    }

    // Si se especifican múltiples campos como array
    return items.filter((item) => {
      return fields.some((field) => {
        return this.searchInField(item, field, searchTerm, exactMatch);
      });
    });
  }

  /**
   * Buscar en todos los campos del objeto
   */
  private searchInAllFields(
    item: any,
    searchTerm: string,
    exactMatch: boolean,
  ): boolean {
    if (!item) return false;

    // Recorrer todas las propiedades del objeto
    for (const key of Object.keys(item)) {
      const value = item[key];
      if (this.searchInField(item, key, searchTerm, exactMatch)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Buscar en un campo específico
   */
  private searchInField(
    item: any,
    field: string,
    searchTerm: string,
    exactMatch: boolean,
  ): boolean {
    const value = this.getNestedValue(item, field);

    if (value === null || value === undefined) {
      return false;
    }

    // Si es string, buscar dentro del texto
    if (typeof value === 'string') {
      const stringValue = value.toLowerCase();
      return exactMatch
        ? stringValue === searchTerm
        : stringValue.includes(searchTerm);
    }

    // Si es número, convertirlo a string
    if (typeof value === 'number') {
      const stringValue = value.toString();
      return exactMatch
        ? stringValue === searchTerm
        : stringValue.includes(searchTerm);
    }

    // Si es booleano, buscar por "true" o "false"
    if (typeof value === 'boolean') {
      return exactMatch
        ? value.toString() === searchTerm
        : value.toString().includes(searchTerm);
    }

    // Si es array, buscar en cada elemento
    if (Array.isArray(value)) {
      return value.some((item) => {
        if (typeof item === 'string') {
          return exactMatch
            ? item.toLowerCase() === searchTerm
            : item.toLowerCase().includes(searchTerm);
        }
        if (typeof item === 'object' && item !== null) {
          return this.searchInAllFields(item, searchTerm, exactMatch);
        }
        return false;
      });
    }

    // Si es objeto anidado, buscar en sus propiedades
    if (typeof value === 'object' && value !== null) {
      return this.searchInAllFields(value, searchTerm, exactMatch);
    }

    return false;
  }

  /**
   * Obtener valor anidado usando notación de puntos (ej: "usuario.nombre")
   */
  private getNestedValue(obj: any, path: string): any {
    if (!obj || !path) return obj;

    const keys = path.split('.');
    let current = obj;

    for (const key of keys) {
      if (current === null || current === undefined) {
        return undefined;
      }
      current = current[key];
    }

    return current;
  }
}
