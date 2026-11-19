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
import { EmpresaService } from '../../../../core/services/empresa/empresa.service';

@Component({
  selector: 'app-piso-form',
  standalone: true,
  imports: [ReactiveFormsModule, MatDialogModule, MaterialModule],
  templateUrl: './piso-form.component.html',
  styleUrls: ['./piso-form.component.scss'],
})
export class PisoFormComponent {
  private fb = inject(FormBuilder);
  private empresaService = inject(EmpresaService);
  private dialogRef = inject(MatDialogRef<PisoFormComponent>);

  form: FormGroup;
  guardando = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { piso?: any; edificioId: number },
  ) {
    this.form = this.fb.group({
      numero: [data.piso?.numero || '', Validators.required],
    });
  }

  guardar() {
    if (this.form.invalid) return;
    this.guardando = true;
    const payload = {
      numero: this.form.value.numero,
      edificio: this.data.edificioId,
    };

    // Aquí iría la lógica de actualizar si es edición (similar a edificio)
    this.empresaService.crearPiso(payload).subscribe({
      next: () => this.dialogRef.close(true),
      error: () => (this.guardando = false),
    });
  }
}
