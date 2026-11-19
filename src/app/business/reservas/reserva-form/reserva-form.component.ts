import { Component, Inject, inject, OnInit, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
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
import { Subject, takeUntil } from 'rxjs';
import { ReservaService } from '../../../core/services/reserva/reserva.service';
import { ConfiguracionService } from '../../../core/services/configuracion/configuracion.service';
import { CATALOGOS } from '../../../core/config/catalogos.config';
import { TablerIconsModule } from 'angular-tabler-icons';
import { NotificationService } from '../../../shared/notifications/notification.service';

@Component({
  selector: 'app-reserva-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MaterialModule,
    TablerIconsModule,
  ],
  templateUrl: './reserva-form.component.html',
  styleUrls: ['./reserva-form.component.scss'],
})
export class ReservaFormComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private reservaService = inject(ReservaService);
  private configService = inject(ConfiguracionService);
  private dialogRef = inject(MatDialogRef<ReservaFormComponent>);
  private notification = inject(NotificationService);

  form: FormGroup;
  guardando = false;

  huespedes: any[] = [];
  habitacionesDisponibles: any[] = [];
  buscandoHabitaciones = false;
  porcentajeIva: number = 12;
  precioNino: number = 0;
  ivaMostrado: number = 12;

  private destroy$ = new Subject<void>();

  constructor(@Inject(MAT_DIALOG_DATA) public data: { hotelId: number }) {
    this.form = this.fb.group({
      huesped_titular: ['', Validators.required],
      fecha_entrada: ['', Validators.required],
      fecha_salida: ['', Validators.required],
      cantidad_adultos: [1, [Validators.required, Validators.min(1)]],
      cantidad_ninos: [0, [Validators.required, Validators.min(0)]],
      habitaciones_seleccionadas: this.fb.array([]),
      acompanantes: this.fb.array([]),

      subtotal_calculado: [{ value: 0, disabled: true }],
      subtotal_final: [0, [Validators.required, Validators.min(0)]],
      descuento: [0],
      motivo_ajuste: [''],
      impuestos: [{ value: 0, disabled: true }],
      total: [{ value: 0, disabled: true }],
    });
  }

  ngOnInit() {
    this.reservaService
      .obtenerHuespedes(this.data.hotelId)
      .subscribe((res) => (this.huespedes = res));

    // Cargar IVA
    this.configService.obtenerConfiguraciones(CATALOGOS.IVA).subscribe((c) => {
      const iva = c.find((x) => x.clave.toUpperCase() === 'IVA');
      if (iva) this.porcentajeIva = Number(iva.valor);
      this.calcularTotales(); // Recalcular al cargar IVA
    });

    // Cargar Precio de Niños (Catálogo 6)
    this.configService
      .obtenerConfiguraciones(CATALOGOS.VALOR_ESTANCIA_NINOS)
      .subscribe((c) => {
        const nino = c.find(
          (x) =>
            x.clave.toLowerCase() === 'niño' ||
            x.clave.toLowerCase() === 'nino',
        );
        if (nino) this.precioNino = Number(nino.valor);
        this.calcularTotales(); // Recalcular al cargar precio niño
      });

    // Escuchar cambios que afecten el precio
    this.form
      .get('fecha_entrada')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(() => this.buscarDisponibilidad());
    this.form
      .get('fecha_salida')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(() => this.buscarDisponibilidad());
    this.form
      .get('cantidad_adultos')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(() => this.calcularTotales());
    this.form
      .get('cantidad_ninos')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(() => this.calcularTotales());
    this.form
      .get('subtotal_final')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(() => this.calcularImpuestos());
    this.form
      .get('descuento')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(() => this.calcularImpuestos());

this.configService.obtenerConfiguraciones(CATALOGOS.IVA).subscribe((c) => {
  // Buscamos el IVA que tenga la marca es_default (El que configuramos como global)
  // Si por alguna razón no hay ninguno marcado, usamos el primero por defecto
  const ivaDefault = c.find((x) => x.es_default === true) || c[0];

  if (ivaDefault) {
    this.porcentajeIva = Number(ivaDefault.valor);
    this.ivaMostrado = this.porcentajeIva;
    this.calcularTotales();
  }
});
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // --- HABITACIONES ---
  get habitacionesArray(): FormArray {
    return this.form.get('habitaciones_seleccionadas') as FormArray;
  }

  toggleHabitacion(hab: any, event: any) {
    if (event.checked) {
      this.habitacionesArray.push(this.fb.control(hab));
    } else {
      const index = this.habitacionesArray.controls.findIndex(
        (x) => x.value.id === hab.id,
      );
      if (index > -1) this.habitacionesArray.removeAt(index);
    }
    this.calcularTotales();
  }

  buscarDisponibilidad() {
    const entrada = this.form.get('fecha_entrada')?.value;
    const salida = this.form.get('fecha_salida')?.value;

    if (entrada && salida && new Date(salida) >= new Date(entrada)) {
      this.buscandoHabitaciones = true;
      this.habitacionesArray.clear();

      this.reservaService
        .obtenerHabitacionesDisponibles(
          this.data.hotelId,
          entrada.toISOString(),
          salida.toISOString(),
        )
        .subscribe({
          next: (habits) => {
            this.habitacionesDisponibles = habits;
            this.buscandoHabitaciones = false;
          },
          error: () => (this.buscandoHabitaciones = false),
        });
    }
  }

  // --- ACOMPAÑANTES ---
  get acompanantesArray(): FormArray {
    return this.form.get('acompanantes') as FormArray;
  }

  eliminarAcompanante(index: number) {
    this.acompanantesArray.removeAt(index);
  }

  // --- CÁLCULOS ---
  // calcularTotales() {
  //   const entrada = this.form.get('fecha_entrada')?.value;
  //   const salida = this.form.get('fecha_salida')?.value;
  //   if (!entrada || !salida) return;

  //   const diffTime = Math.abs(
  //     new Date(salida).getTime() - new Date(entrada).getTime(),
  //   );
  //   let noches = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  //   if (noches === 0) noches = 1;

  //   const adultos = Number(this.form.get('cantidad_adultos')?.value) || 1;
  //   const ninos = Number(this.form.get('cantidad_ninos')?.value) || 0;

  //   // 1. Costo Habitación (Precio Base * Adultos)
  //   let totalHabitaciones = 0;
  //   this.habitacionesArray.controls.forEach((control) => {
  //     totalHabitaciones += Number(control.value.precio_base);
  //   });
  //   const costoAdultos = totalHabitaciones * adultos;

  //   // 2. Costo Niños
  //   const costoNinos = ninos * this.precioNino;

  //   // 3. Servicios y Consumos (en el frontend los sumamos si los tuvieras en el form)
  //   const totalServicios = 0;

  //   // 4. Subtotal
  //   const subtotalCalculado = (costoAdultos + costoNinos) * noches; // Multiplicamos por noches

  //   // 5. IVA y Total
  //   const factorIva = this.porcentajeIva / 100;
  //   const impuestos = subtotalCalculado * factorIva;
  //   const total = subtotalCalculado + impuestos;

  //   this.form.patchValue(
  //     {
  //       subtotal_calculado: Number(subtotalCalculado.toFixed(2)),
  //       subtotal_final: Number(subtotalCalculado.toFixed(2)),
  //       impuestos: Number(impuestos.toFixed(2)),
  //       total: Number(total.toFixed(2)),
  //     },
  //     { emitEvent: false },
  //   );

  //   this.calcularImpuestos();
  // }

  calcularTotales() {
    const entrada = this.form.get('fecha_entrada')?.value;
    const salida = this.form.get('fecha_salida')?.value;
    if (!entrada || !salida) return;

    const diffTime = Math.abs(
      new Date(salida).getTime() - new Date(entrada).getTime(),
    );
    let noches = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (noches === 0) noches = 1;

    const adultos = Number(this.form.get('cantidad_adultos')?.value) || 1;
    const ninos = Number(this.form.get('cantidad_ninos')?.value) || 0;

    let totalHabitaciones = 0;
    this.habitacionesArray.controls.forEach((control) => {
      totalHabitaciones += Number(control.value.precio_base);
    });

    const costoAdultos = totalHabitaciones * adultos;
    const costoNinos = ninos * this.precioNino;
    const subtotalCalculado = (costoAdultos + costoNinos) * noches;

    // --- LÓGICA DE IVA DINÁMICO ---
    let ivaAplicable = this.porcentajeIva; // Inicia con el global (12)

    // Si hay habitaciones seleccionadas, revisamos la primera para ver si trae un IVA de promoción
    if (this.habitacionesArray.length > 0) {
      const habSeleccionada = this.habitacionesArray.at(0).value;

      // Convertimos a número y verificamos que no sea null ni undefined
      const ivaTemp = habSeleccionada.iva_temporada;

      if (ivaTemp !== null && ivaTemp !== undefined && ivaTemp !== '') {
        ivaAplicable = Number(ivaTemp);
      }
    }

    // Calculamos
    const factorIva = ivaAplicable / 100;
    const impuestos = subtotalCalculado * factorIva;
    const total = subtotalCalculado + impuestos;

    // Actualizamos el valor visual del IVA
    this.ivaMostrado = ivaAplicable;

    this.form.patchValue(
      {
        subtotal_calculado: Number(subtotalCalculado.toFixed(2)),
        subtotal_final: Number(subtotalCalculado.toFixed(2)),
        impuestos: Number(impuestos.toFixed(2)),
        total: Number(total.toFixed(2)),
      },
      { emitEvent: false },
    );
  }

  calcularImpuestos() {
    const subtotalFinal = Number(this.form.get('subtotal_final')?.value) || 0;
    const descuento = Number(this.form.get('descuento')?.value) || 0;

    const baseImponible = Math.max(0, subtotalFinal - descuento);
    const factorIva = this.porcentajeIva / 100;
    const impuestos = baseImponible * factorIva;
    const total = baseImponible + impuestos;

    this.form.patchValue(
      {
        impuestos: Number(impuestos.toFixed(2)),
        total: Number(total.toFixed(2)),
      },
      { emitEvent: false },
    );
  }

  guardar() {
    // Validación de cantidad de pax
    const adultosDeclarados = Number(
      this.form.get('cantidad_adultos')?.value || 0,
    );
    const ninosDeclarados = Number(this.form.get('cantidad_ninos')?.value || 0);

    const adultosRegistrados =
      this.acompanantesArray.controls.filter((c) => !c.value.es_nino).length +
      1; // +1 por el titular
    const ninosRegistrados = this.acompanantesArray.controls.filter(
      (c) => c.value.es_nino,
    ).length;

    if (
      adultosRegistrados !== adultosDeclarados ||
      ninosRegistrados !== ninosDeclarados
    ) {
      this.notification.warning(
        `Debes registrar exactamente ${adultosDeclarados} adultos (incluyendo al titular) y ${ninosDeclarados} niños en la lista de acompañantes.`,
      );
      return;
    }

    if (this.form.invalid || this.habitacionesArray.length === 0) {
      this.form.markAllAsTouched();
      this.notification.error(
        'Por favor, completa todos los campos y selecciona al menos una habitación.',
      );
      return;
    }

    this.guardando = true;

    const rawValues = this.form.getRawValue();

    const detalles = this.habitacionesArray.controls.map((c) => ({
      habitacion: c.value.id,
      precio_base_habitacion: Number(c.value.precio_base), // Enviamos el precio base puro
    }));

    const payload = {
      ...rawValues,
      detalles: detalles,
      // Enviamos estos valores por si acaso, pero el backend los sobreescribirá
      subtotal_final: 0,
      impuestos: 0,
      total: 0,
    };

    this.reservaService.crearReserva(this.data.hotelId, payload).subscribe({
      next: () => this.dialogRef.close(true),
      error: (err) => {
        console.error(err);
        this.guardando = false;
      },
    });
  }
  // Agrega estos métodos de ayuda
  get totalPaxDeclarados(): number {
    return (
      Number(this.form.get('cantidad_adultos')?.value || 0) +
      Number(this.form.get('cantidad_ninos')?.value || 0)
    );
  }

  get totalAcompanantes(): number {
    return this.acompanantesArray.length;
  }

  get puedeAgregarAcompanante(): boolean {
    // El titular ya cuenta como 1 adulto.
    // Entonces los acompañantes permitidos son: (Adultos - 1) + Niños
    const adultosExtra =
      Number(this.form.get('cantidad_adultos')?.value || 1) - 1;
    const ninos = Number(this.form.get('cantidad_ninos')?.value || 0);
    const maxAcompanantes = adultosExtra + ninos;

    return this.acompanantesArray.length < maxAcompanantes;
  }

  agregarAcompanante() {
    if (!this.puedeAgregarAcompanante) return;

    this.acompanantesArray.push(
      this.fb.group({
        nombres: ['', Validators.required],
        apellidos: ['', Validators.required],
        es_nino: [false],
        documento: [''],
      }),
    );
  }
}
