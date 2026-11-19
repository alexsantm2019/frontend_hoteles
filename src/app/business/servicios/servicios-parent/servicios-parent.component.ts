import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MaterialModule } from '../../../material.module';
import { TablerIconsModule } from 'angular-tabler-icons';
import { ServicioService } from '../../../core/services/comercializacion/servicio.service';
import { EmpresaService } from '../../../core/services/empresa/empresa.service';
import { Servicio } from '../../../core/models/servicio.models';
import { ServicioFormComponent } from '../servicio-form/servicio-form.component';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog.component';
import { ConfiguracionService } from '../../../core/services/configuracion/configuracion.service';

@Component({
  selector: 'app-servicios-parent',
  standalone: true,
  imports: [CommonModule, MaterialModule, TablerIconsModule],
  templateUrl: './servicios-parent.component.html',
  styleUrls: ['./servicios-parent.component.scss'],
})
export class ServiciosParentComponent implements OnInit {
  private servicioService = inject(ServicioService);
  private empresaService = inject(EmpresaService);
  private configService = inject(ConfiguracionService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  hotelActivo = this.empresaService.hotelActivo;
  servicios = signal<Servicio[]>([]);
  cargando = signal(true);
  unidadesCobro: any[] = [];

  ngOnInit() {
    this.cargarServicios();
    this.cargarUnidadesCobro();
  }

  cargarServicios() {
    const hotel = this.hotelActivo();
    if (hotel) {
      this.cargando.set(true);
      this.servicioService.obtenerServicios(hotel.id).subscribe({
        next: (data) => {
          this.servicios.set(data);
          this.cargando.set(false);
        },
        error: () => this.cargando.set(false),
      });
    }
  }

  cargarUnidadesCobro() {
    this.configService.obtenerConfiguraciones(7 as any).subscribe((res) => {
      this.unidadesCobro = res;
    });
  }

  getNombreUnidad(valor: string): string {
    const unidad = this.unidadesCobro.find((u) => u.valor === valor);
    return unidad ? unidad.clave : valor;
  }

  abrirFormulario(servicio?: Servicio) {
    const hotel = this.hotelActivo();
    if (!hotel) return;

    const dialogRef = this.dialog.open(ServicioFormComponent, {
      width: '500px',
      disableClose: true,
      data: { servicio, hotelId: hotel.id },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.snackBar.open(
          servicio ? 'Servicio actualizado' : 'Servicio creado',
          'OK',
          { duration: 3000 },
        );
        this.cargarServicios();
      }
    });
  }

  eliminarServicio(servicio: Servicio) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Eliminar Servicio',
        message: `¿Estás seguro de eliminar el servicio "${servicio.nombre}"?`,
        confirmText: 'Sí, eliminar',
        confirmColor: 'warn',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.servicioService.eliminarServicio(servicio.id!).subscribe({
          next: () => {
            this.snackBar.open('Servicio eliminado', 'OK', { duration: 3000 });
            this.cargarServicios();
          },
          error: () =>
            this.snackBar.open('No se pudo eliminar el servicio', 'Cerrar', {
              duration: 3000,
            }),
        });
      }
    });
  }
}
