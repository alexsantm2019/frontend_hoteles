import { Injectable, inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private toastr = inject(ToastrService);

  success(mensaje: string, titulo: string = 'Éxito') {
    this.toastr.success(mensaje, titulo, {
      timeOut: 3000,
      positionClass: 'toast-top-right',
      progressBar: true,
      closeButton: true,
    });
  }

  error(mensaje: string, titulo: string = 'Error') {
    this.toastr.error(mensaje, titulo, {
      timeOut: 4000,
      positionClass: 'toast-top-right',
      progressBar: true,
      closeButton: true,
    });
  }

  warning(mensaje: string, titulo: string = 'Advertencia') {
    this.toastr.warning(mensaje, titulo, {
      timeOut: 4000,
      positionClass: 'toast-top-right',
      progressBar: true,
      closeButton: true,
    });
  }

  info(mensaje: string, titulo: string = 'Información') {
    this.toastr.info(mensaje, titulo, {
      timeOut: 3000,
      positionClass: 'toast-top-right',
      progressBar: true,
      closeButton: true,
    });
  }
}
