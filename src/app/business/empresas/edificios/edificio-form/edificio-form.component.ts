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
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { EmpresaService } from '../../../../core/services/empresa/empresa.service';
import { Edificio } from '../../../../core/models/empresa.models';

@Component({
  selector: 'app-edificio-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
  ],
  templateUrl: './edificio-form.component.html',
  styleUrls: ['./edificio-form.component.scss'],
})
export class EdificioFormComponent {
  private fb = inject(FormBuilder);
  private empresaService = inject(EmpresaService);
  private dialogRef = inject(MatDialogRef<EdificioFormComponent>);

  form: FormGroup;
  esEdicion = false;
  hotelId: number;
  guardando = false;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { edificio?: Edificio; hotelId: number },
  ) {
    this.hotelId = data.hotelId;
    this.esEdicion = !!data.edificio;

    this.form = this.fb.group({
      nombre: [
        data.edificio?.nombre || '',
        [Validators.required, Validators.maxLength(255)],
      ],
    });
  }

  guardar() {
    if (this.form.invalid) return;
    this.guardando = true;

    const payload = {
      nombre: this.form.value.nombre,
      hotel: this.hotelId,
    };

    const request$ = this.esEdicion
      ? this.empresaService.actualizarEdificio(this.data.edificio!.id, payload)
      : this.empresaService.crearEdificio(payload);

    request$.subscribe({
      next: () => {
        this.guardando = false;
        this.dialogRef.close(true); // true indica éxito
      },
      error: () => {
        this.guardando = false;
      },
    });
  }
}
