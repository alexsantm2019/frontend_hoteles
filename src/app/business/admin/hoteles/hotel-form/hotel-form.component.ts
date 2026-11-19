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
import { MaterialModule } from '../../../../material.module';
import { CommonModule } from '@angular/common';
import { EmpresaService } from '../../../../core/services/empresa/empresa.service';
import { NotificationService } from '../../../../shared/notifications/notification.service';
import { Hotel } from '../../../../core/models/empresa.models';

@Component({
  selector: 'app-hotel-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MaterialModule],
  templateUrl: './hotel-form.component.html',
  styleUrls: ['./hotel-form.component.scss'],
})
export class HotelFormComponent {
  private fb = inject(FormBuilder);
  private empresaService = inject(EmpresaService);
  private notification = inject(NotificationService);
  private dialogRef = inject(MatDialogRef<HotelFormComponent>);

  form: FormGroup;
  guardando = false;
  esEdicion = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { hotel?: Hotel; empresaId: number },
  ) {
    this.esEdicion = !!data.hotel;

    this.form = this.fb.group({
      nombre: [
        data.hotel?.nombre || '',
        [Validators.required, Validators.maxLength(255)],
      ],
      slug: [
        data.hotel?.slug || '',
        [Validators.required, Validators.maxLength(255)],
      ],
      direccion: [data.hotel?.direccion || ''],
      activo: [data.hotel?.activo ?? true],
    });
  }

  guardar() {
    if (this.form.invalid) return;
    this.guardando = true;

    const payload = {
      ...this.form.value,
      empresa: this.data.empresaId, // <-- Asignamos la empresa automáticamente
    };

    const request$ = this.esEdicion
      ? this.empresaService.actualizarHotelAdmin(this.data.hotel!.id!, payload)
      : this.empresaService.crearHotelAdmin(payload);

    request$.subscribe({
      next: () => {
        this.guardando = false;
        this.dialogRef.close(true);
      },
      error: (err) => {
        console.error(err);
        this.notification.error(
          err.error?.slug?.[0] || 'Error al guardar el hotel',
        );
        this.guardando = false;
      },
    });
  }
}
