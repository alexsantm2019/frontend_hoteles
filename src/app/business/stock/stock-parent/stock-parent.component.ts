import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog'; // <-- Importar
import { MaterialModule } from '../../../material.module';
import { TablerIconsModule } from 'angular-tabler-icons';
import { InventarioService } from '../../../core/services/inventario/inventario.service';
import { EmpresaService } from '../../../core/services/empresa/empresa.service';
import { StockFormComponent } from '../stock-form/stock-form.component'; // <-- Ruta correcta
import { NotificationService } from '../../../shared/notifications/notification.service';

@Component({
  selector: 'app-stock-parent',
  standalone: true,
  imports: [CommonModule, MaterialModule, TablerIconsModule],
  templateUrl: './stock-parent.component.html',
  styleUrls: ['./stock-parent.component.scss'],
})
export class StockParentComponent implements OnInit {
  private inventarioService = inject(InventarioService);
  private empresaService = inject(EmpresaService);
  private dialog = inject(MatDialog); // <-- Inyectar
  private notification = inject(NotificationService);

  hotelActivo = this.empresaService.hotelActivo;
  stockBodega = signal<any[]>([]);
  stockHabitaciones = signal<any[]>([]);
  cargando = signal(true);

  ngOnInit() {
    this.cargarStock();
  }

  cargarStock() {
    const hotel = this.hotelActivo();
    if (hotel) {
      this.cargando.set(true);
      this.inventarioService.obtenerStock(hotel.id).subscribe((res) => {
        this.stockBodega.set(res.filter((s) => s.habitacion === null));
        this.stockHabitaciones.set(res.filter((s) => s.habitacion !== null));
        this.cargando.set(false);
      });
    }
  }

  // MÉTODO PARA ABRIR EL MODAL DE MOVIMIENTO
  abrirModalMovimiento(producto: any, tipo: 'ingreso' | 'transferencia') {
    // Ojo: El stock nos devuelve producto_nombre, pero para el modal
    // necesitamos el objeto producto (o al menos id y nombre)
    const productoData = {
      id: producto.producto,
      nombre: producto.producto_nombre,
    };

    const dialogRef = this.dialog.open(StockFormComponent, {
      width: '400px',
      disableClose: true,
      data: { producto: productoData, tipo },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.notification.success(
          tipo === 'ingreso' ? 'Stock ingresado a bodega' : 'Stock transferido',
        );
        this.cargarStock(); // Recargar para ver los cambios
      }
    });
  }
  // Abre el modal vacío (desde el botón de arriba)
  abrirModalIngreso() {
    this.abrirModalStock(undefined, 'ingreso');
  }

  // Abre el modal con un producto de la tabla
  abrirModalStock(stockItem: any, tipo: 'ingreso' | 'transferencia') {
    let productoData = null;

    if (stockItem) {
      productoData = {
        id: stockItem.producto,
        nombre: stockItem.producto_nombre,
      };
    }

    const dialogRef = this.dialog.open(StockFormComponent, {
      width: '400px',
      disableClose: true,
      // Si productoData es null, el modal debe permitir seleccionar un producto
      data: { producto: productoData, tipo },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.notification.success(
          tipo === 'ingreso' ? 'Stock ingresado a bodega' : 'Stock transferido',
        );
        this.cargarStock();
      }
    });
  }
}
