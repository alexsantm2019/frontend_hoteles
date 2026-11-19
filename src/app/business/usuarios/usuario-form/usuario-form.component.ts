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
import { UsuarioService } from '../../../core/services/usuario/usuario.service';
import { EmpresaService } from '../../../core/services/empresa/empresa.service';
import { NotificationService } from '../../../shared/notifications/notification.service';

@Component({
  selector: 'app-usuario-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MaterialModule],
  templateUrl: './usuario-form.component.html',
  styleUrls: ['./usuario-form.component.scss'],
})
export class UsuarioFormComponent implements OnInit {
  // 1. Inyecciones con inject() (excepto las del diálogo)
  private fb = inject(FormBuilder);
  private usuarioService = inject(UsuarioService);
  private empresaService = inject(EmpresaService);
  private notification = inject(NotificationService);

  form: FormGroup;
  roles: any[] = [];
  hoteles: any[] = [];
  guardando = false;
  esEdicion = false;

  // 2. Constructor SOLO para el diálogo
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { usuario?: any },
    public dialogRef: MatDialogRef<UsuarioFormComponent>,
  ) {
    this.esEdicion = !!this.data.usuario;

    this.form = this.fb.group({
      username: [
        { value: this.data.usuario?.username || '', disabled: this.esEdicion },
        Validators.required,
      ],
      email: [
        this.data.usuario?.email || '',
        [Validators.required, Validators.email],
      ],
      first_name: [this.data.usuario?.first_name || '', Validators.required],
      last_name: [this.data.usuario?.last_name || '', Validators.required],
      password: [
        '',
        this.esEdicion ? [] : [Validators.required, Validators.minLength(6)],
      ],
      rol_id: ['', Validators.required],
      hoteles: [[], Validators.required],
      is_active: [this.data.usuario?.is_active ?? true],
    });
  }

  ngOnInit() {
    console.log('Datos del usuario en el modal:', this.data.usuario);
    this.cargarRoles();
    this.cargarHoteles();
  }

  cargarRoles() {
    this.usuarioService.obtenerRoles().subscribe({
      next: (res) => {
        this.roles = res;
        if (this.esEdicion && this.data.usuario?.rol_id_actual) {
          this.form.get('rol_id')?.setValue(this.data.usuario.rol_id_actual);
        }
      },
    });
  }

  cargarHoteles() {
    const hotelActivo = this.empresaService.hotelActivo();
    if (hotelActivo && hotelActivo.empresa) {
      this.usuarioService.obtenerHotelesEmpresa(hotelActivo.empresa).subscribe({
        next: (res) => {
          this.hoteles = res;
          if (this.esEdicion && this.data.usuario?.hoteles_ids_actuales) {
            this.form
              .get('hoteles')
              ?.setValue(this.data.usuario.hoteles_ids_actuales);
          }
        },
      });
    }
  }

  guardar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    // 1. Obtener el ID de la empresa de forma segura
    const hotelActivo = this.empresaService.hotelActivo();
    const empresaId = hotelActivo?.empresa;

    // 2. Validar que exista
    if (!empresaId) {
      this.notification.error(
        'No se pudo determinar la empresa. Por favor, recarga la página.',
      );
      return;
    }

    this.guardando = true;
    const payload = this.form.getRawValue();

    // Limpiamos la contraseña si está vacía en modo edición
    if (
      this.esEdicion &&
      (!payload.password || payload.password.trim() === '')
    ) {
      delete payload.password;
    }

    // 3. Llamada al servicio (ya sabemos que empresaId es un number)
    const request$ = this.esEdicion
      ? this.usuarioService.actualizarUsuario(this.data.usuario.id, payload)
      : this.usuarioService.crearUsuario(payload, empresaId);

    request$.subscribe({
      next: () => {
        this.guardando = false;
        this.dialogRef.close(true);
      },
      error: (err) => {
        console.error(err);
        this.notification.error('Error al guardar. Revisa la consola.');
        this.guardando = false;
      },
    });
  }
}
