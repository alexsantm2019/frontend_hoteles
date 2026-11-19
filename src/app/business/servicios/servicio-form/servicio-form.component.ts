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
import { ServicioService } from '../../../core/services/comercializacion/servicio.service';
import { ConfiguracionService } from '../../../core/services/configuracion/configuracion.service';
import { Servicio } from '../../../core/models/servicio.models';
import { OnlyNumbersDirective } from '../../../core/directives/only-numbers.directive';

@Component({
  selector: 'app-servicio-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MaterialModule,
    OnlyNumbersDirective,
  ],
  templateUrl: './servicio-form.component.html',
  styleUrls: ['./servicio-form.component.scss'],
})
export class ServicioFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private servicioService = inject(ServicioService);
  private configService = inject(ConfiguracionService);
  private dialogRef = inject(MatDialogRef<ServicioFormComponent>);

  form: FormGroup;
  guardando = false;
  esEdicion = false;
  unidadesCobro: any[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { servicio?: Servicio; hotelId: number },
  ) {
    this.esEdicion = !!data.servicio;

    this.form = this.fb.group({
      nombre: [
        data.servicio?.nombre || '',
        [Validators.required, Validators.maxLength(255)],
      ],
      descripcion: [data.servicio?.descripcion || ''],
      precio: [
        data.servicio?.precio || 0,
        [Validators.required, Validators.min(0)],
      ],
      unidad_cobro: [data.servicio?.unidad_cobro || '4', Validators.required], // 4 = Cobro Único por defecto
    });
  }

  ngOnInit() {
    // Cargar catálogo 7 (Unidades de Cobro) desde core
    this.configService.obtenerConfiguraciones(7 as any).subscribe((res) => {
      this.unidadesCobro = res;
    });
  }

  guardar() {
    if (this.form.invalid) return;
    this.guardando = true;

    const payload = this.form.value;

    const request$ = this.esEdicion
      ? this.servicioService.actualizarServicio(
          this.data.servicio!.id!,
          payload,
        )
      : this.servicioService.crearServicio(this.data.hotelId, payload);

    request$.subscribe({
      next: () => this.dialogRef.close(true),
      error: () => (this.guardando = false),
    });
  }
}
