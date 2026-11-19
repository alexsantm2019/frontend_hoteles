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
import { Servicio } from '../../../core/models/servicio.models';

@Component({
  selector: 'app-servicio-reserva-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MaterialModule],
  templateUrl: './servicio-reserva-form.component.html',
  styleUrls: ['./servicio-reserva-form.component.scss'],
})
export class ServicioReservaFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private servicioService = inject(ServicioService);
  private dialogRef = inject(MatDialogRef<ServicioReservaFormComponent>);

  form: FormGroup;
  serviciosHotel: Servicio[] = [];
  guardando = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { reserva: any; hotelId: number },
  ) {
    this.form = this.fb.group({
      servicio: ['', Validators.required],
      cantidad: [1, [Validators.required, Validators.min(1)]],
    });
  }

  ngOnInit() {
    this.servicioService
      .obtenerServicios(this.data.hotelId)
      .subscribe((res) => {
        this.serviciosHotel = res;
      });
  }

  guardar() {
    if (this.form.invalid) return;
    this.guardando = true;

    const servicioId = this.form.value.servicio;
    const servicioSeleccionado = this.serviciosHotel.find(
      (s) => s.id === servicioId,
    );

    const payload = {
      reserva: this.data.reserva.id,
      servicio: servicioId,
      cantidad: this.form.value.cantidad,
      precio_unitario_snapshot: servicioSeleccionado?.precio,
    };

    this.servicioService.cargarServicioReserva(payload).subscribe({
      next: () => this.dialogRef.close(true),
      error: () => (this.guardando = false),
    });
  }
}
