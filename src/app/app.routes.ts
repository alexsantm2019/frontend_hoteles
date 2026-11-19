import { Routes } from '@angular/router';
import { BlankComponent } from './layouts/blank/blank.component';
import { FullComponent } from './layouts/full/full.component';
import { AuthGuard } from './core/guard/auth.guard';

export const routes: Routes = [
  // 1. RUTA PRINCIPAL: Redirigir al login
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full',
  },

  // 2. RUTAS PÚBLICAS (sin guard): login, error, etc.
  {
    path: 'auth',
    component: BlankComponent,
    loadChildren: () =>
      import('./core/routes/auth.routes').then((m) => m.AuthRoutes),
  },
  {
    path: 'authentication',
    component: BlankComponent,
    loadChildren: () =>
      import('./pages/authentication/authentication.routes').then(
        (m) => m.AuthenticationRoutes,
      ),
  },

  // 3. RUTAS PRIVADAS (con guard): todo lo que necesite autenticación
  {
    path: 'business',
    component: FullComponent,
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./core/routes/main.routes').then((m) => m.MainRoutes),
  },

  {
    path: 'admin',
    component: FullComponent,
    // canActivate: [authGuard],
    loadChildren: () =>
      import('./core/routes/admin.routes').then((m) => m.AdminRoutes),
  },

  // 4. COMODÍN: solo al final
  {
    path: '**',
    redirectTo: 'authentication/error',
  },
];
