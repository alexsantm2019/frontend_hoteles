import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const token = auth.token;

  // No interceptar la petición de refresh ni login (evita bucles)
  const isAuthEndpoint =
    req.url.includes('/auth/refresh') || req.url.includes('/auth/login');

  if (isAuthEndpoint) {
    // Para login/refresh, solo aseguramos withCredentials, sin token
    return next(req.clone({ withCredentials: true }));
  }

  // Petición normal: agregar token y withCredentials
  let authReq = req.clone({ withCredentials: true });
  if (token) {
    authReq = authReq.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
  }

  return next(authReq).pipe(
    catchError((err: HttpErrorResponse) => {
      // Si falla con 401, intentamos refrescar UNA sola vez
      if (err.status === 401 && !req.url.includes('/auth/me')) {
        return auth.refresh().pipe(
          switchMap(() => {
            const retry = req.clone({
              withCredentials: true,
              setHeaders: { Authorization: `Bearer ${auth.token}` },
            });
            return next(retry);
          }),
          catchError((refreshErr) => {
            auth.clearSession();
            router.navigate(['/auth/login']);
            return throwError(() => refreshErr);
          }),
        );
      }
      return throwError(() => err);
    }),
  );
};
