import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MaterialModule } from '../../../material.module';
import { AuthService } from 'src/app/core/services/auth/auth.service';

@Component({
  selector: 'app-error',
  standalone: true,
  imports: [RouterModule, MaterialModule],
  templateUrl: './error.component.html',
})
export class AppErrorComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  logout() {
    this.authService.logout().subscribe({
      next: () => this.router.navigate(['/auth/login']),
      error: () => {
        this.authService.clearSession();
        this.router.navigate(['/auth/login']);
      },
    });
  }
}
