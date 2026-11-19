import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './core/services/auth/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
})
// export class AppComponent {
//   title = 'Modernize Angular Admin Tempplate';
// }

// Adaptación para que pueda detectar inactividad
export class AppComponent implements OnInit, OnDestroy {
  title = 'Sistema hotelero Saas';

  private authService = inject(AuthService);

  ngOnInit(): void {
    // this.authService.startInactivityTimer();
    // this.authService.initializeAuth().subscribe();
  }

  ngOnDestroy(): void {
    // this.authService.stopInactivityTimer();
  }
}
