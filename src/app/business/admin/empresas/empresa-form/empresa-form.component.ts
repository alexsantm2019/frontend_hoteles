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
import { Empresa } from '../../../../core/models/empresa.models';

@Component({
  selector: 'app-empresa-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MaterialModule],
  templateUrl: './empresa-form.component.html',
  styleUrls: ['./empresa-form.component.scss'],
})
export class EmpresaFormComponent {
  private fb = inject(FormBuilder);
  private empresaService = inject(EmpresaService);
  private notification = inject(NotificationService);
  private dialogRef = inject(MatDialogRef<EmpresaFormComponent>);

  form: FormGroup;
  guardando = false;
  esEdicion = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { empresa?: Empresa }) {
    this.esEdicion = !!data.empresa;

    this.form = this.fb.group({
      nombre: [
        data.empresa?.nombre || '',
        [Validators.required, Validators.maxLength(255)],
      ],
      ruc: [
        data.empresa?.ruc || '',
        [Validators.required, Validators.maxLength(20)],
      ],
      direccion: [data.empresa?.direccion || ''], // <-- NUEVO
      telefono: [data.empresa?.telefono || ''], // <-- NUEVO
      correo: [data.empresa?.correo || '', [Validators.email]], // <-- NUEVO
      activa: [data.empresa?.activa ?? true],
    });
  }

  guardar() {
    if (this.form.invalid) return;
    this.guardando = true;

    const payload = this.form.value;

    const request$ = this.esEdicion
      ? this.empresaService.actualizarEmpresa(this.data.empresa!.id!, payload)
      : this.empresaService.crearEmpresa(payload);

    request$.subscribe({
      next: () => {
        this.guardando = false;
        this.dialogRef.close(true);
      },
      error: (err) => {
        console.error(err);
        this.notification.error(
          err.error?.ruc?.[0] || 'Error al guardar la empresa',
        );
        this.guardando = false;
      },
    });
  }
}
