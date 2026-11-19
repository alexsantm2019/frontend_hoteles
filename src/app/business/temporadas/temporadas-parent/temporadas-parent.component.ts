import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MaterialModule } from '../../../material.module';
import { TablerIconsModule } from 'angular-tabler-icons';
import { TemporadaService } from '../../../core/services/temporada/temporada.service';
import { EmpresaService } from '../../../core/services/empresa/empresa.service';
import { Temporada } from '../../../core/models/temporada.models';
import { TemporadaFormComponent } from '../temporada-form/temporada-form.component';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog.component';
import { NotificationService } from '../../../shared/notifications/notification.service';

@Component({
  selector: 'app-temporadas-parent',
  standalone: true,
  imports: [CommonModule, MaterialModule, TablerIconsModule],
  templateUrl: './temporadas-parent.component.html',
  styleUrls: ['./temporadas-parent.component.scss'],
})
export class TemporadasParentComponent implements OnInit {
  private temporadaService = inject(TemporadaService);
  private empresaService = inject(EmpresaService);
  private dialog = inject(MatDialog);
  private notification = inject(NotificationService);

  hotelActivo = this.empresaService.hotelActivo;
  temporadas = signal<Temporada[]>([]);
  cargando = signal(true);

  ngOnInit() {
    this.cargarTemporadas();
  }

  cargarTemporadas() {
    const hotel = this.hotelActivo();
    if (hotel) {
      this.cargando.set(true);
      this.temporadaService.obtenerTemporadas(hotel.id).subscribe({
        next: (data) => {
          this.temporadas.set(data);
          this.cargando.set(false);
        },
        error: () => this.cargando.set(false),
      });
    }
  }

  abrirFormulario(temporada?: Temporada) {
    const hotel = this.hotelActivo();
    if (!hotel) return;

    const dialogRef = this.dialog.open(TemporadaFormComponent, {
      width: '500px',
      disableClose: true,
      data: { temporada, hotelId: hotel.id },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.notification.success(
          temporada ? 'Temporada actualizada' : 'Temporada creada',
        );
        this.cargarTemporadas();
      }
    });
  }

  eliminarTemporada(temporada: Temporada) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Eliminar Temporada',
        message: `¿Estás seguro de eliminar la promoción "${temporada.nombre}"?`,
        confirmText: 'Sí, eliminar',
        confirmColor: 'warn',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.temporadaService.eliminarTemporada(temporada.id!).subscribe({
          next: () => {
            this.notification.success('Temporada eliminada');
            this.cargarTemporadas();
          },
          error: () =>
            this.notification.error('No se pudo eliminar la temporada'),
        });
      }
    });
  }
}
