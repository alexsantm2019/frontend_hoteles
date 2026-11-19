import { ChangeDetectorRef, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { PruebaService } from 'src/app/core/services/prueba/prueba.service';
import { CommonModule } from '@angular/common';
import { environment } from '../../core/environments/environment';
import { Subscription, timer } from 'rxjs';
import { MaterialModule } from '../../core/material-module/material.module';

@Component({
  selector: 'app-prueba',
  templateUrl: './prueba.component.html',
  styleUrls: ['./prueba.component.scss'],
  standalone: true,
  imports: [CommonModule,  MaterialModule],
})
export class PruebaComponent implements OnInit, OnDestroy {
  currentUser: any;
  accessToken: any;
  refreshToken: any;
  expiresAt: any;
  refreshIn: any;
  refreshInFormatted: any;
  refreshInMs: any;
  expiresAtFormatted: any;
  tokenMessage: any;
  isLoading = false;
  errorMessage: string | null = null;

  private authService = inject(AuthService);
  private pruebaService = inject(PruebaService);
  private cdr = inject(ChangeDetectorRef);

  remainingSeconds = 0;
  countdownFormatted = '00:00:00';
  tokenExpired = false;
  expiresAtToken: any;
  private countdownSubscription?: Subscription;

  ngOnDestroy(): void {
    this.countdownSubscription?.unsubscribe();
  }
  ngOnInit(): void {
    // this.authService.currentUser$.subscribe((user) => {
    //   this.currentUser = user;
    //   this.accessToken = this.authService.getToken();
    //   this.expiresAt = this.authService.getTokenExpiresAt();

    //   console.log('Fecha de expiración:', this.expiresAt);
    //   console.log('Tipo de expiresAt:', typeof this.expiresAt);

    //   this.consumirApiTest();

    //   if (this.expiresAt) {
    //     const expiresDate = new Date(this.expiresAt);
    //     this.expiresAtFormatted = expiresDate.toLocaleString();

    //     // Iniciar el contador regresivo
    //     this.startTokenCountdown();
    //   }
    //   this.cdr.detectChanges();
    // });
  }

  startTokenCountdown(): void {
    // this.countdownSubscription?.unsubscribe();

    // this.countdownSubscription = timer(0, 1000).subscribe(() => {
    //   if (!this.expiresAt) {
    //     this.countdownFormatted = '--:--:--';
    //     return;
    //   }

    //   let expirationTime: number;

    //   if (typeof this.expiresAt === 'number') {
    //     // Unix en segundos o timestamp en milisegundos
    //     expirationTime =
    //       this.expiresAt < 1e12 ? this.expiresAt * 1000 : this.expiresAt;
    //   } else {
    //     expirationTime = new Date(this.expiresAt).getTime();
    //   }

    //   if (Number.isNaN(expirationTime)) {
    //     this.countdownFormatted = '--:--:--';
    //     return;
    //   }

    //   const currentTime = Date.now();

    //   this.remainingSeconds = Math.max(
    //     0,
    //     Math.floor((expirationTime - currentTime) / 1000),
    //   );

    //   const hours = Math.floor(this.remainingSeconds / 3600);
    //   const minutes = Math.floor((this.remainingSeconds % 3600) / 60);
    //   const seconds = this.remainingSeconds % 60;

    //   this.countdownFormatted = [hours, minutes, seconds]
    //     .map((value) => String(value).padStart(2, '0'))
    //     .join(':');

    //   this.tokenExpired = this.remainingSeconds === 0;

    //   this.cdr.detectChanges();
    // });
  }

  consumirApiTest(): void {
    // this.isLoading = true;
    // this.errorMessage = null;
    // console.log('📤 Consumiendo API de test...');
    // this.pruebaService.getTest().subscribe({
    //   next: (response) => {
    //     console.log('✅ Respuesta:', response);
    //     this.tokenMessage = response;
    //     this.isLoading = false;
    //     this.cdr.detectChanges();
    //   },
    //   error: (error) => {
    //     console.error('❌ Error:', error);
    //     this.errorMessage = error.message || 'Error al consumir la API';
    //     this.isLoading = false;
    //     this.cdr.detectChanges();
    //   },
    // });
  }
  // private pad(num: number): string {
  //   return num.toString().padStart(2, '0');
  // }
  // formatDuration(ms: number): string {
  //   if (ms < 0) ms = 0; // Evitar negativos
  //   const totalSeconds = Math.floor(ms / 1000);
  //   const hours = Math.floor(totalSeconds / 3600);
  //   const minutes = Math.floor((totalSeconds % 3600) / 60);
  //   const seconds = totalSeconds % 60;
  //   return `${this.pad(hours)}:${this.pad(minutes)}:${this.pad(seconds)}`;
  // }

  logout() {
    this.authService.logout();
  }
}
