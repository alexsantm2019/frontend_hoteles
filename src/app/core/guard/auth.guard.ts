import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

export const authGuard: CanActivateFn = async () => {

  return true;
  const auth = inject(AuthService);
  const router = inject(Router);

  await auth.ensureAuthInitialized();

  if (auth.isAuthenticated) {
    return true;
  }
  return router.createUrlTree(['/auth/login']);
};

export const AuthGuard = authGuard;
