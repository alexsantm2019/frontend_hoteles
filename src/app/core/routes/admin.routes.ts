import { Routes } from '@angular/router';
import { LoginComponent } from '../../business/auth/login/login.component';
// import { authGuard } from "./core/guard/auth.guard";

export const AdminRoutes: Routes = [
  {
    path: 'admin-dashboard',
    // canActivate: [authGuard], // Podríamos crear un SuperAdminGuard después
    loadComponent: () =>
      import('../../business/admin/dashboard/dashboard.component').then(
        (m) => m.DashboardComponent,
      ),
  },
  {
    path: 'empresas',
    loadComponent: () =>
      import('../../business/admin/empresas/empresas-parent/empresas-parent.component').then(
        (m) => m.EmpresasParentComponent,
      ),
    data: {
      title: 'Empresas',
    },
  },

  {
    path: '',
    redirectTo: 'admin-dashboard',
    pathMatch: 'full',
  },
];
