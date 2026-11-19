import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmpresaService } from '../../../core/services/empresa/empresa.service';
import { ConfiguracionService } from '../../../core/services/configuracion/configuracion.service';
import { CATALOGOS } from '../../../core/config/catalogos.config';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../core/environments/environment';
import { MaterialModule } from '../../../material.module';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-tablero-habitaciones',
  standalone: true,
  imports: [CommonModule, MaterialModule, TablerIconsModule],
  templateUrl: './tablero-habitaciones.component.html',
  styleUrls: ['./tablero-habitaciones.component.scss'],
})
export class TableroHabitacionesComponent implements OnInit {
  private empresaService = inject(EmpresaService);
  private configService = inject(ConfiguracionService);
  private http = inject(HttpClient);
  private snackBar = inject(MatSnackBar);

  hotelActivo = this.empresaService.hotelActivo;
  habitaciones = signal<any[]>([]);
  cargando = signal(true);
  estadosLimpieza: any[] = [];

  ngOnInit() {
    this.cargarCatalogo();
    this.cargarHabitaciones();
  }

  cargarCatalogo() {
    this.configService
      .obtenerConfiguraciones(CATALOGOS.ESTADOS_LIMPIEZA)
      .subscribe((res) => {
        this.estadosLimpieza = res;
      });
  }

  cargarHabitaciones() {
    const hotel = this.hotelActivo();
    if (hotel) {
      this.http
        .get<
          any[]
        >(`${environment.apiUrl}/empresas/hoteles/${hotel.id}/tablero/`)
        .subscribe({
          next: (res) => {
            this.habitaciones.set(res);
            this.cargando.set(false);
          },
          error: () => this.cargando.set(false),
        });
    }
  }

  // Método para obtener el texto del estado según el número
  getNombreLimpieza(valor: string): string {
    const estado = this.estadosLimpieza.find((e) => e.valor == valor);
    return estado ? estado.clave : valor;
  }

  getColorEstado(valorEstado: string): string {
    const estado = this.estadosLimpieza.find((e) => e.valor == valorEstado);
    return estado && estado.color ? estado.color : '#6c757d'; // Gris por defecto
  }

  actualizarEstado(habitacion: any, nuevoEstado: string) {
    this.empresaService
      .cambiarEstadoHabitacion(habitacion.id, nuevoEstado)
      .subscribe({
        next: () => {
          this.snackBar.open('Estado actualizado correctamente', 'OK', {
            duration: 3000,
          });
          // Actualizamos localmente para no recargar toda la tabla
          habitacion.estado_limpieza = nuevoEstado;
        },
        error: () =>
          this.snackBar.open('Error al actualizar', 'Cerrar', {
            duration: 3000,
          }),
      });
  }
  trackById(index: number, item: any) {
    return item.id;
  }
}
