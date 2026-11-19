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
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../material.module';
import { PagosService } from '../../../core/services/pagos/pagos.service';
import { OnlyNumbersDirective } from '../../../core/directives/only-numbers.directive';
import { ConfiguracionService } from '../../../core/services/configuracion/configuracion.service';
import { CATALOGOS } from '../../../core/config/catalogos.config';

@Component({
  selector: 'app-pago-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MaterialModule,
    OnlyNumbersDirective,
  ],
  templateUrl: './pago-form.component.html',
  styleUrls: ['./pago-form.component.scss'],
})
export class PagoFormComponent {
  private fb = inject(FormBuilder);
  private pagosService = inject(PagosService);
  private dialogRef = inject(MatDialogRef<PagoFormComponent>);
  private catalogoService = inject(ConfiguracionService);

  metodosPago: any[] = [];
  form: FormGroup;
  guardando = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { reserva: any }) {
    this.form = this.fb.group({
      // Por defecto sugerimos pagar todo el saldo pendiente
      monto: [
        data.reserva.saldo_pendiente,
        [Validators.required, Validators.min(0.01)],
      ],
      metodo: ['efectivo', Validators.required],
      referencia: [''],
    });
  }

  ngOnInit() {
    // Cargar métodos de pago desde la tabla core
    this.cargarCatalogo();
    
  }

  cargarCatalogo() {
    this.catalogoService
      .obtenerConfiguraciones(CATALOGOS.METODOS_PAGO)
      .subscribe((res) => {
        this.metodosPago = res;
      });
  }

  guardar() {
    if (this.form.invalid) return;
    this.guardando = true;

    const payload = {
      reserva: this.data.reserva.id,
      monto: Number(this.form.value.monto),
      metodo: this.form.value.metodo,
      referencia: this.form.value.referencia,
    };

    this.pagosService.registrarPago(payload).subscribe({
      next: () => {
        this.guardando = false;
        this.dialogRef.close(true); // Devuelve true para que la tabla se recargue
      },
      error: (err) => {
        console.error('Error al registrar pago:', err);
        this.guardando = false;
      },
    });
  }
}
