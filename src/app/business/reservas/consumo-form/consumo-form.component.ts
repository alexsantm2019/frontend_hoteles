import { Component, Inject, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogModule,
} from '@angular/material/dialog';
import { MaterialModule } from '../../../material.module';
import { CommonModule } from '@angular/common';
import { InventarioService } from '../../../core/services/inventario/inventario.service';
import { Producto } from '../../../core/models/inventario.models';


@Component({
  selector: 'app-consumo-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MaterialModule],
  templateUrl: './consumo-form.component.html',
  styleUrls: ['./consumo-form.component.scss'],
})
export class ConsumoFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private inventarioService = inject(InventarioService);
  private dialogRef = inject(MatDialogRef<ConsumoFormComponent>);

  form: FormGroup;
  productos: Producto[] = [];
  guardando = false;
  stockHabitacion: any[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { reserva: any; hotelId: number },
  ) {
    this.form = this.fb.group({
      producto: ['', Validators.required],
      cantidad: [1, [Validators.required, Validators.min(1)]],
    });
  }

  ngOnInit() {
    this.obtenerProductos();
    // 1. Obtenemos la habitación principal de la reserva
    // (Asumimos que la reserva tiene al menos una habitación en sus detalles)
    const habitacionId = this.data.reserva.detalles[0]?.habitacion;

    if (habitacionId) {
      // 2. Consultamos solo el stock de ESA habitación
      this.obtenerStockHabitacion(habitacionId);
    }
  }

  obtenerProductos() {
    this.inventarioService
      .obtenerProductos(this.data.hotelId)
      .subscribe((res) => {
        this.productos = res;
      });
  }

  obtenerStockHabitacion(habitacionId: number) {
    this.inventarioService
      .obtenerStockHabitacion(habitacionId)
      .subscribe((res) => {
        this.stockHabitacion = res;
      });
  }

  guardar() {
    if (this.form.invalid) return;
    this.guardando = true;

    const productoId = this.form.value.producto;
    // Buscamos el item en el stock que ya tenemos cargado
    const stockItem = this.stockHabitacion.find(
      (p) => p.producto === productoId,
    );

    const payload = {
      reserva: this.data.reserva.id,
      producto: productoId,
      cantidad: this.form.value.cantidad,
      // AQUÍ ESTABA EL ERROR: Ahora usamos el campo que viene del backend
      precio_venta_snapshot: Number(stockItem?.producto_precio_venta) || 0,
    };

    this.inventarioService.registrarConsumo(payload).subscribe({
      next: () => this.dialogRef.close(true),
      error: () => (this.guardando = false),
    });
  }
}
