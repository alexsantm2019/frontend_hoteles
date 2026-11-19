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
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { ReservaService } from '../../../core/services/reserva/reserva.service';
import { OnlyLettersDirective } from '../../../core/directives/only-letters.directive';
import { OnlyNumbersDirective } from '../../../core/directives/only-numbers.directive';
import { CedulaDirective } from '../../../core/directives/cedula.directive';
import { cedulaEcuatorianaValidator } from '../../../core/validators/cedula.validator';

@Component({
  selector: 'app-huesped-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    OnlyLettersDirective,
    OnlyNumbersDirective,
    CedulaDirective,
  ],
  templateUrl: './huesped-form.component.html',
  styleUrls: ['./huesped-form.component.scss'],
})
export class HuespedFormComponent {
  private fb = inject(FormBuilder);
  private reservaService = inject(ReservaService);
  private dialogRef = inject(MatDialogRef<HuespedFormComponent>);

  form: FormGroup;
  guardando = false;
  esEdicion = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { huesped?: any; hotelId: number },
  ) {
    this.esEdicion = !!data.huesped;

    this.form = this.fb.group({
      nombres: [
        data.huesped?.nombres || '',
        [Validators.required, Validators.maxLength(255)],
      ],
      apellidos: [
        data.huesped?.apellidos || '',
        [Validators.required, Validators.maxLength(255)],
      ],
      tipo_documento: [
        data.huesped?.tipo_documento || 'cedula',
        Validators.required,
      ],
      // documento: [
      //   data.huesped?.documento || '',
      //   [Validators.required, Validators.maxLength(50)],
      // ],
      documento: [
        data.huesped?.documento || '',
        [Validators.required, cedulaEcuatorianaValidator()],
      ],
      email: [data.huesped?.email || '', [Validators.email]],
      telefono: [data.huesped?.telefono || ''],
    });

    this.form.get('tipo_documento')?.valueChanges.subscribe((tipo) => {
      const docControl = this.form.get('documento');
      if (tipo === 'cedula') {
        docControl?.setValidators([
          Validators.required,
          cedulaEcuatorianaValidator(),
        ]);
        docControl?.setValue('');
      } else {
        docControl?.setValidators([
          Validators.required,
          Validators.maxLength(20),
        ]);
        docControl?.setValue('');
      }
      docControl?.updateValueAndValidity();
    });
  }

  guardar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.guardando = true;

    const payload = this.form.value;

    const request$ = this.esEdicion
      ? this.reservaService.actualizarHuesped(
          this.data.hotelId,
          this.data.huesped.id,
          payload,
        )
      : this.reservaService.crearHuesped(this.data.hotelId, payload);

    request$.subscribe({
      next: () => this.dialogRef.close(true),
      error: (err) => {
        console.error(err);
        this.guardando = false;
      },
    });
  }
}
