import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MaterialModule } from '../../../material.module';
// --- IMPORTS DE LA TABLA ---
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { TablerIconsModule } from 'angular-tabler-icons';
import { ReservaService } from '../../../core/services/reserva/reserva.service';
import { EmpresaService } from '../../../core/services/empresa/empresa.service';
import { Reserva } from '../../../core/models/reserva.models';
import { ReservaFormComponent } from '../reserva-form/reserva-form.component';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog.component';
import { PagoFormComponent } from '../../pagos/pago-form/pago-form.component';
import { ConfiguracionService } from '../../../core/services/configuracion/configuracion.service';
import { CATALOGOS } from '../../../core/config/catalogos.config';
import { ServicioService } from '../../../core/services/comercializacion/servicio.service';
import { Servicio } from '../../../core/models/servicio.models';
import { DetalleServicioReserva } from '../../../core/models/servicio.models';
import { ServicioReservaFormComponent } from '../../servicios/servicio-reserva-form/servicio-reserva-form.component';
import { NotificationService } from '../../../shared/notifications/notification.service';
import { ConsumoFormComponent } from '../consumo-form/consumo-form.component';
import { InventarioService } from '../../../core/services/inventario/inventario.service';


@Component({
  selector: 'app-reservas-parent',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatCardModule,
    TablerIconsModule,
  ],
  templateUrl: './reservas-parent.component.html',
  styleUrls: ['./reservas-parent.component.scss'],
})
export class ReservasParentComponent implements OnInit {
  private reservaService = inject(ReservaService);
  private empresaService = inject(EmpresaService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  private configService = inject(ConfiguracionService);
  private servicioService = inject(ServicioService);
  private notificationService = inject(NotificationService);
  private inventarioService = inject(InventarioService);

  estadosReserva: any[] = [];
  hotelActivo = this.empresaService.hotelActivo;
  reservas = signal<Reserva[]>([]);
  cargando = signal(true);
  catalogoService: any;
  expandedElement: Reserva | null = null;
  serviciosHotel: Servicio[] = [];

  ngOnInit() {
    this.cargarReservas();
    this.cargarCatalogo();
    this.cargarServiciosHotel();
  }

  cargarServiciosHotel() {
    const hotel = this.hotelActivo();
    if (hotel) {
      this.servicioService.obtenerServicios(hotel.id).subscribe((res) => {
        this.serviciosHotel = res;
      });
    }
  }

  cargarReservas() {
    const hotel = this.hotelActivo();
    if (hotel) {
      this.cargando.set(true);
      this.reservaService.obtenerReservas(hotel.id).subscribe({
        next: (data) => {
          this.reservas.set(data);
          this.cargando.set(false);
        },
        error: () => this.cargando.set(false),
      });
    }
  }

  abrirFormulario() {
    const hotel = this.hotelActivo();
    if (!hotel) return;

    const dialogRef = this.dialog.open(ReservaFormComponent, {
      width: '700px', // Más ancho porque tiene fechas y habitaciones
      disableClose: true,
      data: { hotelId: hotel.id },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.snackBar.open('Reserva creada exitosamente', 'OK', {
          duration: 3000,
        });
        this.cargarReservas();
      }
    });
  }
  cambiarEstado(
    reserva: Reserva,
    nuevoEstado: string,
    titulo: string,
    mensaje: string,
  ) {
    const hotel = this.hotelActivo();
    if (!hotel) return;
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: titulo,
        message: mensaje,
        confirmText: 'Sí, continuar',
        confirmColor: nuevoEstado === 'cancelada' ? 'warn' : 'primary',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // Enviamos el hotel.id y la reserva.id
        this.reservaService
          .cambiarEstadoReserva(hotel.id, reserva.id!, nuevoEstado)
          .subscribe({
            next: () => {
              this.snackBar.open(`Reserva actualizada`, 'OK', {
                duration: 3000,
              });
              this.cargarReservas();
            },
            error: () =>
              this.snackBar.open('Error al actualizar el estado', 'Cerrar', {
                duration: 3000,
              }),
          });
      }
    });
  }

  abrirPago(reserva: Reserva) {
    const dialogRef = this.dialog.open(PagoFormComponent, {
      width: '450px',
      disableClose: true,
      data: { reserva },
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.snackBar.open('Pago registrado correctamente', 'OK', {
          duration: 3000,
        });
        this.cargarReservas();
      }
    });
  }

  cargarCatalogo() {
    this.configService
      .obtenerConfiguraciones(CATALOGOS.ESTADOS_RESERVA)
      .subscribe({
        next: (tipos) => {
          this.estadosReserva = tipos;
        },
      });
  }

  getNombreEstado(valorEstado: string | number): string {
    if (valorEstado === null || valorEstado === undefined) return '';

    // Convertimos a string y quitamos espacios por si acaso
    const valorBuscado = String(valorEstado).trim();

    // Buscamos en el catálogo
    const estado = this.estadosReserva.find(
      (e) => String(e.valor).trim() === valorBuscado,
    );

    // Si lo encuentra, devuelve la 'clave'. Si no, devuelve el número original.
    return estado ? estado.clave : valorBuscado;
  }
  toggleRow(element: Reserva) {
    this.expandedElement = this.expandedElement === element ? null : element;
  }
  // Agregamos un método para abrir el modal de servicios
  abrirModalServicio(reserva: Reserva) {
    const hotel = this.hotelActivo();
    if (!hotel) return;

    const dialogRef = this.dialog.open(ServicioReservaFormComponent, {
      width: '450px',
      disableClose: true,
      data: { reserva, hotelId: hotel.id },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.snackBar.open('Servicio cargado correctamente', 'OK', {
          duration: 3000,
        });
        this.cargarReservas(); // Recargar para actualizar totales
      }
    });
  }

  eliminarServicioReserva(servicioId: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Eliminar Servicio',
        message:
          '¿Estás seguro de eliminar este servicio de la reserva? El total se recalculará automáticamente.',
        confirmText: 'Sí, eliminar',
        confirmColor: 'warn',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.servicioService.eliminarConsumo(servicioId).subscribe({
          next: () => {
            this.notificationService.success(
              'Servicio eliminado y total recalculado',
            );
            this.cargarReservas(); // Recargar la tabla para ver los nuevos totales
          },
          error: () =>
            this.notificationService.error('Error al eliminar servicio'),
        });
      }
    });
  }
  // Método para cargar el servicio a la reserva
  cargarServicio(reserva: Reserva) {
    // Por ahora usamos un prompt para seleccionar el ID del servicio
    // (Luego podemos cambiarlo por un diálogo elegante)
    const servicioId = prompt(
      'Ingrese el ID del servicio a cargar (ej. 1 para desayuno):',
    );
    if (!servicioId) return;

    const servicio = this.serviciosHotel.find(
      (s) => s.id === Number(servicioId),
    );
    if (!servicio) {
      // alert('Servicio no encontrado');
      this.snackBar.open(`Servicio no encontrado`, 'Cerrar', {
        duration: 5000,
        panelClass: ['bg-warning', 'text-white'],
      });
      return;
    }

    const cantidadStr = prompt('Ingrese la cantidad:');
    if (!cantidadStr) return;
    const cantidad = Number(cantidadStr);

    const payload = {
      reserva: reserva.id,
      servicio: servicio.id,
      cantidad: cantidad,
      precio_unitario_snapshot: servicio.precio,
    };

    this.servicioService.cargarServicioReserva(payload).subscribe({
      next: () => {
        this.snackBar.open('Servicio cargado', 'OK', { duration: 3000 });
        this.cargarReservas(); // Recargar la tabla para ver el nuevo total
      },
      error: (err) => {
        console.error(err);
        this.snackBar.open('Error al cargar servicio', 'Cerrar', {
          duration: 3000,
        });
      },
    });
  }
  abrirModalConsumo(reserva: Reserva) {
    const hotel = this.hotelActivo();
    if (!hotel) return;

    const dialogRef = this.dialog.open(ConsumoFormComponent, {
      width: '450px',
      disableClose: true,
      data: { reserva, hotelId: hotel.id },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.notificationService.success('Consumo cargado correctamente');
        this.cargarReservas(); // Recargar totales
      }
    });
  }
  eliminarConsumo(consumoId: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Eliminar Consumo',
        message:
          '¿Estás seguro de eliminar este consumo? El producto volverá al stock y el total de la reserva se recalculará.',
        confirmText: 'Sí, eliminar',
        confirmColor: 'warn',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.inventarioService.eliminarConsumo(consumoId).subscribe({
          next: () => {
            this.notificationService.success(
              'Consumo eliminado y stock devuelto',
            );
            this.cargarReservas(); // Recargamos para ver el nuevo total
          },
          error: () =>
            this.notificationService.error('Error al eliminar el consumo'),
        });
      }
    });
  }

  descargarPDF(reserva: Reserva) {
    this.reservaService.descargarPDF(reserva.id!).subscribe({
      next: (blob) => {
        // Creamos un enlace temporal para forzar la descarga
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Reserva_${reserva.codigo}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        this.notificationService.success('PDF generado correctamente');
      },
      error: () => this.notificationService.error('Error al generar el PDF'),
    });
  }
}

