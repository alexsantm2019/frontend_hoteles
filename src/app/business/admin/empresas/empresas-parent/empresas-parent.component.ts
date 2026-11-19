import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MaterialModule } from '../../../../material.module';
import { TablerIconsModule } from 'angular-tabler-icons';
import { EmpresaService } from '../../../../core/services/empresa/empresa.service';
import { EmpresaFormComponent } from '../empresa-form/empresa-form.component';
import { NotificationService } from '../../../../shared/notifications/notification.service';
import { ConfirmDialogComponent } from '../../../../shared/confirm-dialog/confirm-dialog.component';
import { HotelesEmpresaComponent } from '../../hoteles/hoteles-empresa/hoteles-empresa.component';

@Component({
  selector: 'app-empresas-parent',
  standalone: true,
  imports: [CommonModule, MaterialModule, TablerIconsModule],
  templateUrl: './empresas-parent.component.html',
  styleUrls: ['./empresas-parent.component.scss'],
})
export class EmpresasParentComponent implements OnInit {
  private empresaService = inject(EmpresaService);
  private dialog = inject(MatDialog);
  private notification = inject(NotificationService);

  empresas = signal<any[]>([]);
  cargando = signal(true);

  ngOnInit() {
    this.cargarEmpresas();
  }

  cargarEmpresas() {
    this.cargando.set(true);
    this.empresaService.obtenerEmpresasAdmin().subscribe({
      next: (data) => {
        this.empresas.set(data);
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false),
    });
  }

  abrirFormulario(empresa?: any) {
    const dialogRef = this.dialog.open(EmpresaFormComponent, {
      width: '500px',
      disableClose: true,
      data: { empresa },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.notification.success(
          empresa ? 'Empresa actualizada' : 'Empresa creada',
        );
        this.cargarEmpresas();
      }
    });
  }

  eliminarEmpresa(empresa: any) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Eliminar Empresa',
        message: `¿Estás seguro de eliminar "${empresa.nombre}"?`,
        confirmText: 'Sí, eliminar',
        confirmColor: 'warn',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.empresaService.eliminarEmpresa(empresa.id).subscribe({
          next: () => {
            this.notification.success('Empresa eliminada');
            this.cargarEmpresas();
          },
          error: () => this.notification.error('No se pudo eliminar'),
        });
      }
    });
  }
  abrirHoteles(empresa: any) {
    const dialogRef = this.dialog.open(HotelesEmpresaComponent, {
      width: '700px',
      disableClose: true,
      data: { empresaId: empresa.id, empresaNombre: empresa.nombre },
    });

    // (Opcional: recargar empresas al cerrar si quieres actualizar el contador de hoteles)
    dialogRef.afterClosed().subscribe(() => this.cargarEmpresas());
  }
}
