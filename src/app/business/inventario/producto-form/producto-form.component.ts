import { Component, Inject, inject } from '@angular/core';
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
import { OnlyNumbersDirective } from '../../../core/directives/only-numbers.directive';

@Component({
  selector: 'app-producto-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MaterialModule,
    OnlyNumbersDirective,
  ],
  templateUrl: './producto-form.component.html',
  styleUrls: ['./producto-form.component.scss'],
})
export class ProductoFormComponent {
  private fb = inject(FormBuilder);
  private inventarioService = inject(InventarioService);
  private dialogRef = inject(MatDialogRef<ProductoFormComponent>);

  form: FormGroup;
  guardando = false;
  esEdicion = false;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { producto?: Producto; hotelId: number },
  ) {
    this.esEdicion = !!data.producto;
    this.form = this.fb.group({
      nombre: [data.producto?.nombre || '', Validators.required],
      categoria: [data.producto?.categoria || ''],
      precio_compra: [
        data.producto?.precio_compra || 0,
        [Validators.required, Validators.min(0)],
      ],
      precio_venta: [
        data.producto?.precio_venta || 0,
        [Validators.required, Validators.min(0)],
      ],
      stock_minimo: [
        data.producto?.stock_minimo || 5,
        [Validators.required, Validators.min(0)],
      ],
      activo: [data.producto?.activo ?? true],
    });
  }

  guardar() {
    if (this.form.invalid) return;
    this.guardando = true;

    const payload = this.form.value;
    const request$ = this.esEdicion
      ? this.inventarioService.actualizarProducto(
          this.data.producto!.id!,
          payload,
        )
      : this.inventarioService.crearProducto(this.data.hotelId, payload);

    request$.subscribe({
      next: () => this.dialogRef.close(true),
      error: () => (this.guardando = false),
    });
  }
}
