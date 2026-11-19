import { Component, Inject, inject } from '@angular/core';
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
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { TablerIconsModule } from 'angular-tabler-icons';
import { EmpresaService } from '../../../../core/services/empresa/empresa.service';
import { Habitacion } from '../../../../core/models/empresa.models';
import { ConfiguracionService } from '../../../../core/services/configuracion/configuracion.service';
import { CATALOGOS } from '../../../../core/config/catalogos.config';

@Component({
  selector: 'app-habitacion-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    TablerIconsModule,
  ],
  templateUrl: './habitacion-form.component.html',
  styleUrls: ['./habitacion-form.component.scss'],
})
export class HabitacionFormComponent {
  private fb = inject(FormBuilder);
  private empresaService = inject(EmpresaService);
  private configService = inject(ConfiguracionService);
  private dialogRef = inject(MatDialogRef<HabitacionFormComponent>);
  tiposHabitacion: any[] = [];
  form: FormGroup;
  guardando = false;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { habitacion?: Habitacion; pisoId: number },
  ) {
    this.form = this.fb.group({
      numero: [data.habitacion?.numero || '', Validators.required],
      tipo: [data.habitacion?.tipo || 'doble', Validators.required],
      precio_base: [
        data.habitacion?.precio_base || 0,
        [Validators.required, Validators.min(0)],
      ],
      capacidad_maxima: [
        data.habitacion?.capacidad_maxima || 2,
        [Validators.required, Validators.min(1)],
      ],
      permite_reserva_completa: [
        data.habitacion?.permite_reserva_completa ?? true,
      ],
      permite_reserva_espacios: [
        data.habitacion?.permite_reserva_espacios ?? false,
      ],
      espacios: this.fb.array([]), // Inicializamos el FormArray
    });

    // Si estamos editando y hay espacios, los cargamos
    if (data.habitacion && data.habitacion.espacios) {
      data.habitacion.espacios.forEach((esp) =>
        this.agregarEspacio(esp.nombre),
      );
    }
  }

  ngOnInit() {
    // El catálogo 1 es el de Tipos de Habitación
    this.cargaCatalogo();
  }

  cargaCatalogo() {
    this.configService
      .obtenerConfiguraciones(CATALOGOS.TIPOS_HABITACION)
      .subscribe({
        next: (tipos) => {
          this.tiposHabitacion = tipos;
        },
      });
  }

  // Getter para facilitar el acceso en el HTML
  get espaciosArray(): FormArray {
    return this.form.get('espacios') as FormArray;
  }

  agregarEspacio(nombre: string = '') {
    this.espaciosArray.push(
      this.fb.group({
        nombre: [nombre, Validators.required],
      }),
    );
  }

  eliminarEspacio(index: number) {
    this.espaciosArray.removeAt(index);
  }

  guardar() {
    if (this.form.invalid) return;
    this.guardando = true;

    // Limpiamos los espacios
    const espaciosLimpios = this.espaciosArray.value.map((esp: any) => {
      return {
        ...(esp.id && { id: esp.id }),
        nombre: esp.nombre,
        activo: true,
      };
    });

    const payload = {
      ...this.form.value,
      piso: Number(this.data.pisoId),
      precio_base: Number(this.form.value.precio_base),
      activa: true,
      espacios: espaciosLimpios,
    };

    const req$ = this.data.habitacion
      ? this.empresaService.actualizarHabitacion(
          this.data.habitacion.id,
          payload,
        )
      : this.empresaService.crearHabitacion(payload);

    req$.subscribe({
      next: () => this.dialogRef.close(true),
      error: (err) => {
        console.error('Error al guardar habitación:', err.error);
        this.guardando = false;
      },
    });
  }
}
