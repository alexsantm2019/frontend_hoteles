import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MaterialModule } from '../../../material.module';
import { TablerIconsModule } from 'angular-tabler-icons';
import { InventarioService } from '../../../core/services/inventario/inventario.service';
import { EmpresaService } from '../../../core/services/empresa/empresa.service';
import { Producto } from '../../../core/models/inventario.models';
import { ProductoFormComponent } from '../producto-form/producto-form.component';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog.component';
import { NotificationService } from '../../../shared/notifications/notification.service';
import { StockFormComponent } from '../../stock/stock-form/stock-form.component';

@Component({
  selector: 'app-productos-parent',
  standalone: true,
  imports: [CommonModule, MaterialModule, TablerIconsModule],
  templateUrl: './productos-parent.component.html',
  styleUrls: ['./productos-parent.component.scss'],
})
export class ProductosParentComponent implements OnInit {
  private inventarioService = inject(InventarioService);
  private empresaService = inject(EmpresaService);
  private dialog = inject(MatDialog);
  private notification = inject(NotificationService);

  hotelActivo = this.empresaService.hotelActivo;
  productos = signal<Producto[]>([]);
  cargando = signal(true);

  ngOnInit() {
    this.cargarProductos();
  }

  cargarProductos() {
    const hotel = this.hotelActivo();
    if (hotel) {
      this.cargando.set(true);
      this.inventarioService.obtenerProductos(hotel.id).subscribe({
        next: (data) => {
          this.productos.set(data);
          this.cargando.set(false);
        },
        error: () => this.cargando.set(false),
      });
    }
  }

  abrirFormulario(producto?: Producto) {
    const hotel = this.hotelActivo();
    if (!hotel) return;

    const dialogRef = this.dialog.open(ProductoFormComponent, {
      width: '500px',
      disableClose: true,
      data: { producto, hotelId: hotel.id },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.notification.success(
          producto ? 'Producto actualizado' : 'Producto creado',
        );
        this.cargarProductos();
      }
    });
  }

  eliminarProducto(producto: Producto) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Eliminar Producto',
        message: `¿Estás seguro de eliminar "${producto.nombre}"?`,
        confirmText: 'Sí, eliminar',
        confirmColor: 'warn',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.inventarioService.eliminarProducto(producto.id!).subscribe({
          next: () => {
            this.notification.success('Producto eliminado');
            this.cargarProductos();
          },
          error: () =>
            this.notification.error('No se pudo eliminar el producto'),
        });
      }
    });
  }

}
