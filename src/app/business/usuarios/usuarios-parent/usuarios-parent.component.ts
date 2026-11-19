import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MaterialModule } from '../../../material.module';
import { TablerIconsModule } from 'angular-tabler-icons';
import { UsuarioService } from '../../../core/services/usuario/usuario.service';
import { EmpresaService } from '../../../core/services/empresa/empresa.service';
import { UsuarioFormComponent } from '../usuario-form/usuario-form.component';
import { NotificationService } from '../../../shared/notifications/notification.service';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-usuarios-parent',
  standalone: true,
  imports: [CommonModule, MaterialModule, TablerIconsModule],
  templateUrl: './usuarios-parent.component.html',
  styleUrls: ['./usuarios-parent.component.scss'],
})
export class UsuariosParentComponent implements OnInit {
  private usuarioService = inject(UsuarioService);
  private empresaService = inject(EmpresaService);
  private dialog = inject(MatDialog);
  private notification = inject(NotificationService);

  hotelActivo = this.empresaService.hotelActivo;
  usuarios = signal<any[]>([]);
  cargando = signal(true);

  ngOnInit() {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    const hotel = this.hotelActivo();
    if (hotel && hotel.empresa) {
      this.cargando.set(true);
      this.usuarioService.obtenerUsuarios(hotel.empresa).subscribe({
        next: (data) => {
          this.usuarios.set(data);
          this.cargando.set(false);
        },
        error: (err) => {
          console.error(err);
          this.cargando.set(false);
        },
      });
    } else {
      this.cargando.set(false);
    }
  }

  abrirFormulario(usuario?: any) {
    const dialogRef = this.dialog.open(UsuarioFormComponent, {
      width: '600px',
      disableClose: true,
      data: { usuario }, // Si 'usuario' es undefined, el form sabrá que es creación
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.notification.success(
          usuario ? 'Usuario actualizado' : 'Usuario creado',
        );
        this.cargarUsuarios();
      }
    });
  }

  toggleActivo(usuario: any) {
    const accion = usuario.is_active ? 'desactivar' : 'activar';

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: `${accion.toUpperCase()} Usuario`,
        message: `¿Estás seguro de ${accion} el acceso de ${usuario.first_name} ${usuario.last_name}?`,
        confirmText: `Sí, ${accion}`,
        confirmColor: 'warn',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.usuarioService.cambiarEstadoUsuario(usuario.id).subscribe({
          next: () => {
            this.notification.success(`Usuario ${accion}do correctamente`);
            this.cargarUsuarios();
          },
          error: () => this.notification.error(`Error al ${accion} usuario`),
        });
      }
    });
  }
}
