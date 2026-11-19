import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EmpresaService } from '../../../core/services/empresa/empresa.service';
import { MaterialModule } from '../../../material.module';
import { Edificio, Habitacion } from '../../../core/models/empresa.models';
import { TablerIconsModule } from 'angular-tabler-icons';
import { EdificioFormComponent } from '../edificios/edificio-form/edificio-form.component';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog.component'; 
import { PisoFormComponent } from '../pisos/piso-form/piso-form.component';
import { HabitacionFormComponent } from '../habitaciones/habitacion-form/habitacion-form.component';
@Component({
  selector: 'app-estructura-hotel',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    TablerIconsModule,
    ConfirmDialogComponent,
  ],
  templateUrl: './estructura-hotel.component.html',
  styleUrls: ['./estructura-hotel.component.scss'],
})
export class EstructuraHotelComponent implements OnInit {
  private empresaService = inject(EmpresaService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  hotelActivo = this.empresaService.hotelActivo;
  edificios = signal<Edificio[]>([]);
  cargando = signal(true);

  ngOnInit() {
    this.cargarEstructura();
  }

  cargarEstructura() {
    const hotel = this.hotelActivo();
    if (hotel) {
      this.cargando.set(true);
      this.empresaService.obtenerEstructuraHotel(hotel.id).subscribe({
        next: (data) => {
          this.edificios.set(data);
          this.cargando.set(false);
        },
        error: () => this.cargando.set(false),
      });
    }
  }

  abrirFormulario(edificio?: Edificio) {
    const hotel = this.hotelActivo();
    if (!hotel) return;

    const dialogRef = this.dialog.open(EdificioFormComponent, {
      width: '400px',
      disableClose: true,
      data: { edificio, hotelId: hotel.id },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.snackBar.open(
          edificio ? 'Edificio actualizado' : 'Edificio creado',
          'OK',
          { duration: 3000 },
        );
        this.cargarEstructura(); // Recargamos la lista
      }
    });
  }
  eliminarEdificio(edificio: Edificio) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Eliminar Edificio',
        message: `¿Estás seguro de eliminar el edificio "${edificio.nombre}"? Esta acción no se puede deshacer y fallará si tiene pisos asociados.`,
        confirmText: 'Sí, eliminar',
        confirmColor: 'warn',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.empresaService.eliminarEdificio(edificio.id).subscribe({
          next: () => {
            this.snackBar.open('Edificio eliminado', 'OK', { duration: 3000 });
            this.cargarEstructura();
          },
          error: (err) => {
            // Si el backend rechaza por tener hijos (ej. pisos), mostramos el error
            this.snackBar.open(
              'No se pudo eliminar. Verifica que no tenga pisos.',
              'Cerrar',
              { duration: 4000 },
            );
          },
        });
      }
    });
  }

  abrirFormularioPiso(edificioId: number) {
    const dialogRef = this.dialog.open(PisoFormComponent, {
      width: '400px',
      data: { edificioId },
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res) this.cargarEstructura();
    });
  }

  abrirFormularioHabitacion(pisoId: number, habitacion?: Habitacion) {
    const dialogRef = this.dialog.open(HabitacionFormComponent, {
      width: '500px',
      data: { pisoId: pisoId, habitacion: habitacion },
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res) this.cargarEstructura();
    });
  }

  eliminarHabitacion(habitacion: Habitacion) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Eliminar Habitación',
        message: `¿Estás seguro de eliminar la habitación ${habitacion.numero}?`,
        confirmText: 'Sí, eliminar',
        confirmColor: 'warn',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.empresaService.eliminarHabitacion(habitacion.id).subscribe({
          next: () => {
            this.snackBar.open('Habitación eliminada', 'OK', {
              duration: 3000,
            });
            this.cargarEstructura();
          },
          error: () => {
            this.snackBar.open(
              'No se pudo eliminar. Puede tener reservas activas.',
              'Cerrar',
              { duration: 4000 },
            );
          },
        });
      }
    });
  }
}
