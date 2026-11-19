import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { MaterialModule } from '../../../material.module';
import { TablerIconsModule } from 'angular-tabler-icons';
import { CajaService } from '../../../core/services/caja/caja.service';
import { EmpresaService } from '../../../core/services/empresa/empresa.service';
import { TurnoCaja } from '../../../core/models/caja.models';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-caja-parent',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    TablerIconsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './caja-parent.component.html',
  styleUrls: ['./caja-parent.component.scss'],
})
export class CajaParentComponent implements OnInit {
  private cajaService = inject(CajaService);
  private empresaService = inject(EmpresaService);
  private snackBar = inject(MatSnackBar);
  private fb = inject(FormBuilder);

  hotelActivo = this.empresaService.hotelActivo;
  turnos = signal<TurnoCaja[]>([]);
  turnoAbierto = signal<TurnoCaja | null>(null);
  cargando = signal(true);

  mostrarFormularioApertura = false;
  mostrarFormularioCierre = false;

  formApertura = this.fb.group({
    saldo_inicial: [0, [Validators.required, Validators.min(0)]],
  });
  formCierre = this.fb.group({
    saldo_final_real: [0, [Validators.required, Validators.min(0)]],
    observaciones: [''],
  });

  ngOnInit() {
    this.cargarTurnos();
  }

  cargarTurnos() {
    const hotel = this.hotelActivo();
    if (hotel) {
      this.cargando.set(true);
      this.cajaService.obtenerTurnos(hotel.id).subscribe((res) => {
        this.turnos.set(res);
        this.turnoAbierto.set(res.find((t) => t.estado === 'abierta') || null);
        this.cargando.set(false);
      });
    }
  }

  abrirCaja() {
    if (this.formApertura.invalid) return;
    const hotel = this.hotelActivo();
    if (!hotel) return;

    this.cajaService
      .abrirCaja(hotel.id, Number(this.formApertura.value.saldo_inicial))
      .subscribe({
        next: () => {
          this.snackBar.open('Caja abierta correctamente', 'OK', {
            duration: 3000,
          });
          this.mostrarFormularioApertura = false;
          this.cargarTurnos();
        },
        error: (err) =>
          this.snackBar.open(err.error[0] || 'Error al abrir caja', 'Cerrar', {
            duration: 3000,
          }),
      });
  }

  cerrarCaja() {
    if (this.formCierre.invalid || !this.turnoAbierto()) return;

    const turnoId = this.turnoAbierto()!.id!;
    this.cajaService
      .cerrarCaja(
        turnoId,
        Number(this.formCierre.value.saldo_final_real),
        this.formCierre.value.observaciones || '',
      )
      .subscribe({
        next: () => {
          this.snackBar.open('Caja cerrada correctamente', 'OK', {
            duration: 3000,
          });
          this.mostrarFormularioCierre = false;
          this.cargarTurnos();
        },
        error: () =>
          this.snackBar.open('Error al cerrar caja', 'Cerrar', {
            duration: 3000,
          }),
      });
  }
}
