import { Routes } from '@angular/router';
import { LoginComponent } from '../../business/auth/login/login.component';
// import { authGuard } from "./core/guard/auth.guard";


// para redireccionar a estas vistas, utilizaremos : /auth/xxx
export const AuthRoutes: Routes = [
  {
    path: 'login',
    // component: LoginComponent,
    loadComponent: () =>
      import('../../business/auth/login/login.component').then(
        (m) => m.LoginComponent,
      ),
    data: {
      title: 'Login',
    },
  },
  {
    path: 'selector-hotel',
    // canActivate: [AuthGuard],
    loadComponent: () =>
      import('../../business/empresas/selector-hotel/selector-hotel.component').then(
        (m) => m.SelectorHotelComponent,
      ),
    data: {
      title: 'Seleccionar hotel',
    },
  },
  {
    path: 'logout',
    // component: LoginComponent,
    loadComponent: () =>
      import('../../business/auth/login/login.component').then(
        (m) => m.LoginComponent,
      ),
    data: {
      title: 'Logout',
    },
  },

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
];
