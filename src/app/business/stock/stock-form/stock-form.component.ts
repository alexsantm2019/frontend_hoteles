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
import { EmpresaService } from '../../../core/services/empresa/empresa.service';
import { OnlyNumbersDirective } from '../../../core/directives/only-numbers.directive';
import { Producto } from '../../../core/models/inventario.models';

@Component({
  selector: 'app-stock-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MaterialModule,
    OnlyNumbersDirective,
  ],
  templateUrl: './stock-form.component.html',
  styleUrls: ['./stock-form.component.scss'],
})
export class StockFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private inventarioService = inject(InventarioService);
  private empresaService = inject(EmpresaService);
  private dialogRef = inject(MatDialogRef<StockFormComponent>);

  form: FormGroup;
  guardando = false;

  // Variables para saber qué acción estamos haciendo
  esIngreso: boolean = false;
  habitaciones: any[] = [];
  productos: Producto[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { producto?: any; tipo: 'ingreso' | 'transferencia' },
  ) {
    this.esIngreso = data.tipo === 'ingreso';

    this.form = this.fb.group({
      producto_id: [data.producto?.id || '', Validators.required], // Si viene de la tabla, se autoselecciona
      cantidad: [1, [Validators.required, Validators.min(1)]],
      habitacion_id: [''],
    });

    if (!this.esIngreso) {
      this.form.get('habitacion_id')?.setValidators([Validators.required]);
    }
  }

  ngOnInit() {
    const hotel = this.empresaService.hotelActivo();
    if (hotel) {
      // Cargamos todos los productos por si el usuario quiere elegir uno
      this.inventarioService.obtenerProductos(hotel.id).subscribe((res) => {
        this.productos = res;
      });

      // Si es transferencia, cargamos habitaciones
      if (!this.esIngreso) {
        this.empresaService
          .obtenerHabitacionesHotel(hotel.id)
          .subscribe((res) => {
            this.habitaciones = res;
          });
      }
    }
  }

  guardar() {
    if (this.form.invalid) return;
    this.guardando = true;

    const cantidad = Number(this.form.value.cantidad);
    const productoId = Number(this.form.value.producto_id); // Tomamos el ID del formulario

    if (this.esIngreso) {
      this.inventarioService.ingresarStock(productoId, cantidad).subscribe({
        next: () => this.dialogRef.close(true),
        error: () => (this.guardando = false),
      });
    } else {
      const habId = Number(this.form.value.habitacion_id);
      this.inventarioService
        .transferirHabitacion(productoId, cantidad, habId)
        .subscribe({
          next: () => this.dialogRef.close(true),
          error: () => (this.guardando = false),
        });
    }
  }
}
