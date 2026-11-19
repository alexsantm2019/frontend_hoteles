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
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { MaterialModule } from '../../../material.module';
import { CommonModule } from '@angular/common';
import { TemporadaService } from '../../../core/services/temporada/temporada.service';
import { EmpresaService } from '../../../core/services/empresa/empresa.service';
import { Temporada } from '../../../core/models/temporada.models';
import { ConfiguracionService } from '../../../core/services/configuracion/configuracion.service';
import { CATALOGOS } from '../../../core/config/catalogos.config';

export const fechaTemporadaValidator: ValidatorFn = (
  control: AbstractControl,
): ValidationErrors | null => {
  const inicio = control.get('fecha_inicio')?.value;
  const fin = control.get('fecha_fin')?.value;

  if (inicio && fin && new Date(fin) < new Date(inicio)) {
    return { fechaInvalida: true };
  }
  return null;
};

@Component({
  selector: 'app-temporada-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MaterialModule],
  templateUrl: './temporada-form.component.html',
  styleUrls: ['./temporada-form.component.scss'],
})
export class TemporadaFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private temporadaService = inject(TemporadaService);
  private empresaService = inject(EmpresaService);
  private dialogRef = inject(MatDialogRef<TemporadaFormComponent>);
  private configService = inject(ConfiguracionService);

  form: FormGroup;
  guardando = false;
  esEdicion = false;
  habitaciones: any[] = [];
  ivas: any[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { temporada?: Temporada; hotelId: number },
  ) {
    this.esEdicion = !!data.temporada;

    this.form = this.fb.group(
      {
        nombre: [data.temporada?.nombre || '', Validators.required],
        fecha_inicio: [
          data.temporada?.fecha_inicio
            ? new Date(data.temporada.fecha_inicio)
            : '',
          Validators.required,
        ],
        fecha_fin: [
          data.temporada?.fecha_fin ? new Date(data.temporada.fecha_fin) : '',
          Validators.required,
        ],
        habitaciones: [data.temporada?.habitaciones || []],
        precio_especial: [
          data.temporada?.precio_especial || 0,
          [Validators.required, Validators.min(0)],
        ],
        iva_porcentaje: [data.temporada?.iva_porcentaje || null],
        activa: [data.temporada?.activa ?? true],
      },
      { validators: fechaTemporadaValidator },
    );
  }

  ngOnInit() {
    const hotel = this.empresaService.hotelActivo();
    if (hotel) {
      this.configService
        .obtenerConfiguraciones(CATALOGOS.IVA)
        .subscribe((res) => {
          this.ivas = res;
        });
      this.empresaService
        .obtenerHabitacionesHotel(hotel.id)
        .subscribe((res) => {
          this.habitaciones = res;
        });
    }
  }

  guardar() {
    if (this.form.invalid) return;
    this.guardando = true;

    const formValue = this.form.value;
    const payload = {
      ...formValue,
      fecha_inicio: formValue.fecha_inicio.toISOString().split('T')[0],
      fecha_fin: formValue.fecha_fin.toISOString().split('T')[0],
      precio_especial: Number(formValue.precio_especial),
    };

    const request$ = this.esEdicion
      ? this.temporadaService.actualizarTemporada(
          this.data.temporada!.id!,
          payload,
        )
      : this.temporadaService.crearTemporada(this.data.hotelId, payload);

    request$.subscribe({
      next: () => this.dialogRef.close(true),
      error: () => (this.guardando = false),
    });
  }
}
