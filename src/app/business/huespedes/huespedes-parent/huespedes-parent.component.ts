import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MaterialModule } from '../../../material.module';
import { TablerIconsModule } from 'angular-tabler-icons';
import { ReservaService } from '../../../core/services/reserva/reserva.service';
import { EmpresaService } from '../../../core/services/empresa/empresa.service';
import { HuespedFormComponent } from '../huesped-form/huesped-form.component';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-huespedes-parent',
  standalone: true,
  imports: [CommonModule, MaterialModule, TablerIconsModule],
  templateUrl: './huespedes-parent.component.html',
  styleUrls: ['./huespedes-parent.component.scss'],
})
export class HuespedesParentComponent implements OnInit {
  private reservaService = inject(ReservaService);
  private empresaService = inject(EmpresaService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  hotelActivo = this.empresaService.hotelActivo;
  huespedes = signal<any[]>([]);
  cargando = signal(true);

  ngOnInit() {
    this.cargarHuespedes();
  }

  cargarHuespedes() {
    const hotel = this.hotelActivo();
    if (hotel) {
      this.cargando.set(true);
      this.reservaService.obtenerHuespedes(hotel.id).subscribe({
        next: (data) => {
          this.huespedes.set(data);
          this.cargando.set(false);
        },
        error: () => this.cargando.set(false),
      });
    }
  }

  abrirFormulario(huesped?: any) {
    const hotel = this.hotelActivo();
    if (!hotel) return;

    const dialogRef = this.dialog.open(HuespedFormComponent, {
      width: '500px',
      disableClose: true,
      data: { huesped, hotelId: hotel.id },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.snackBar.open(
          huesped ? 'Huésped actualizado' : 'Huésped creado',
          'OK',
          { duration: 3000 },
        );
        this.cargarHuespedes();
      }
    });
  }

  eliminarHuesped(huesped: any) {
    const hotel = this.hotelActivo();
    if (!hotel) return;
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Eliminar Huésped',
        message: `¿Estás seguro de eliminar a ${huesped.nombres} ${huesped.apellidos}?`,
        confirmText: 'Sí, eliminar',
        confirmColor: 'warn',
      },
    });

dialogRef.afterClosed().subscribe((result) => {
  if (result) {
    // Enviamos el hotel.id y el huesped.id
    this.reservaService.eliminarHuesped(hotel.id, huesped.id).subscribe({
      next: () => {
        this.snackBar.open('Huésped eliminado', 'OK', { duration: 3000 });
        this.cargarHuespedes();
      },
      error: () =>
        this.snackBar.open('No se pudo eliminar', 'Cerrar', { duration: 3000 }),
    });
  }
});
  }
}
