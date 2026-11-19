import { Component, Inject, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { MaterialModule } from '../../../../material.module';
import { TablerIconsModule } from 'angular-tabler-icons';
import { EmpresaService } from '../../../../core/services/empresa/empresa.service';
import { NotificationService } from '../../../../shared/notifications/notification.service';
import { HotelFormComponent } from '../hotel-form/hotel-form.component';
import { ConfirmDialogComponent } from '../../../../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-hoteles-empresa',
  standalone: true,
  imports: [CommonModule, MaterialModule, TablerIconsModule, MatDialogModule],
  templateUrl: './hoteles-empresa.component.html',
  styleUrls: ['./hoteles-empresa.component.scss'],
})
export class HotelesEmpresaComponent implements OnInit {
  private empresaService = inject(EmpresaService);
  private dialog = inject(MatDialog);
  private notification = inject(NotificationService);

  hoteles = signal<any[]>([]);
  cargando = signal(true);

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { empresaId: number; empresaNombre: string },
  ) {}

  ngOnInit() {
    this.cargarHoteles();
  }

  cargarHoteles() {
    this.cargando.set(true);
    // Nota: Necesitamos un endpoint que devuelva los hoteles de una empresa
    this.empresaService.obtenerHotelesEmpresa(this.data.empresaId).subscribe({
      next: (res) => {
        this.hoteles.set(res);
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false),
    });
  }

  abrirFormulario(hotel?: any) {
    const dialogRef = this.dialog.open(HotelFormComponent, {
      width: '500px',
      disableClose: true,
      data: { hotel, empresaId: this.data.empresaId },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.notification.success(hotel ? 'Hotel actualizado' : 'Hotel creado');
        this.cargarHoteles();
      }
    });
  }

  eliminarHotel(hotel: any) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Eliminar Hotel',
        message: `¿Estás seguro de eliminar "${hotel.nombre}"?`,
        confirmText: 'Sí, eliminar',
        confirmColor: 'warn',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.empresaService.eliminarHotelAdmin(hotel.id).subscribe({
          next: () => {
            this.notification.success('Hotel eliminado');
            this.cargarHoteles();
          },
          error: () => this.notification.error('No se pudo eliminar'),
        });
      }
    });
  }
}
