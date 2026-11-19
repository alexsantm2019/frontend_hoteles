import { Routes } from '@angular/router';
import { AuthGuard } from '../guard/auth.guard';
// import { RolesGuard } from '../guard/roles.guard';

export const MainRoutes: Routes = [
  {
    path: 'prueba',
    // canActivate: [AuthGuard],
    loadComponent: () =>
      import('../../business/prueba/prueba.component').then(
        (m) => m.PruebaComponent,
      ),
    data: {
      title: 'Prueba',
    },
  },
  {
    path: 'selector-hotel',
    // canActivate: [AuthGuard],
    loadComponent: () =>
      import('../../business/empresas/selector-hotel/selector-hotel.component').then(
        (m) => m.SelectorHotelComponent,
      ),
  },
  {
    path: 'estructura',
    loadComponent: () =>
      import('../../business/empresas/estructura-hotel/estructura-hotel.component').then(
        (m) => m.EstructuraHotelComponent,
      ),
    data: { title: 'Estructura del Hotel' },
  },
  {
    path: 'reservas',
    loadComponent: () =>
      import('../../business/reservas/reservas-parent/reservas-parent.component').then(
        (m) => m.ReservasParentComponent,
      ),
    data: { title: 'Reservas' },
  },
  {
    path: 'huespedes',
    loadComponent: () =>
      import('../../business/huespedes/huespedes-parent/huespedes-parent.component').then(
        (m) => m.HuespedesParentComponent,
      ),
    data: { title: 'Huéspedes' },
  },
  {
    path: 'tablero',
    loadComponent: () =>
      import('../../business/habitaciones/tablero-habitaciones/tablero-habitaciones.component').then(
        (m) => m.TableroHabitacionesComponent,
      ),
    data: { title: 'Tablero de Habitaciones' },
  },

  {
    path: 'caja',
    loadComponent: () =>
      import('../../business/caja/caja-parent/caja-parent.component').then(
        (m) => m.CajaParentComponent,
      ),
    data: { title: 'Caja' },
  },
  {
    path: 'servicios',
    loadComponent: () =>
      import('../../business/servicios/servicios-parent/servicios-parent.component').then(
        (m) => m.ServiciosParentComponent,
      ),
    data: { title: 'Servicios' },
  },
  {
    path: 'productos',
    loadComponent: () =>
      import('../../business/inventario/productos-parent/productos-parent.component').then(
        (m) => m.ProductosParentComponent,
      ),
    data: { title: 'Servicios' },
  },
  {
    path: 'stock',
    loadComponent: () =>
      import('../../business/stock/stock-parent/stock-parent.component').then(
        (m) => m.StockParentComponent,
      ),
    data: { title: 'Stock' },
  },
  {
    path: 'temporadas',
    loadComponent: () =>
      import('../../business/temporadas/temporadas-parent/temporadas-parent.component').then(
        (m) => m.TemporadasParentComponent,
      ),
    data: { title: 'Temporadas' },
  },

  {
    path: 'dashboard',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('../../business/dashboard/dashboard.component').then(
        (m) => m.DashboardComponent,
      ),
    data: {
      title: 'Dashboard',
    },
  },
  {
    path: 'usuarios',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('../../business/usuarios/usuarios-parent/usuarios-parent.component').then(
        (m) => m.UsuariosParentComponent,
      ),
    data: {
      title: 'Dashboard',
    },
  },
  {
    path: '',
    redirectTo: 'prueba',
    pathMatch: 'full',
  },

  // {
  //   path: 'categorias',
  //   canActivate: [AuthGuard],
  //   loadComponent: () =>
  //     import('../../business/categorias/categorias-parent/categorias-parent.component').then(
  //       (m) => m.CategoriasParentComponent,
  //     ),
  //   data: {
  //     title: 'Categorias',
  //   },
  // },
  // {
  //   path: 'tipos',
  //   canActivate: [AuthGuard],
  //   loadComponent: () =>
  //     import('../../business/tipos/tipos-parent/tipos-parent.component').then(
  //       (m) => m.TiposParentComponent,
  //     ),
  //   data: {
  //     title: 'Tipos',
  //   },
  // },
  // {
  //   path: 'ubicaciones',
  //   canActivate: [AuthGuard],
  //   loadComponent: () =>
  //     import('../../business/ubicaciones/ubicaciones-parent/ubicaciones-parent.component').then(
  //       (m) => m.UbicacionesParentComponent,
  //     ),
  //   data: { title: 'Ubicaciones' },
  // },
  // {
  //   path: 'activos',
  //   canActivate: [AuthGuard],
  //   loadComponent: () =>
  //     import('../../business/activos/activos-parent/activos-parent.component').then(
  //       (m) => m.ActivosParentComponent,
  //     ),
  //   data: { title: 'Activos' },
  // },
  // {
  //   path: 'asignaciones',
  //   canActivate: [AuthGuard],
  //   loadComponent: () =>
  //     import('../../business/asignaciones/asignaciones-parent/asignaciones-parent.component').then(
  //       (m) => m.AsignacionesParentComponent,
  //     ),
  //   data: { title: 'Activos' },
  // },
  // {
  //   path: 'inventario-agrupado',
  //   canActivate: [AuthGuard],
  //   loadComponent: () =>
  //     import('../../business/inventario/inventario-agrupado-parent/inventario-agrupado-parent.component').then(
  //       (m) => m.InventarioAgrupadoParentComponent,
  //     ),
  //   data: { title: 'Resumen de Inventario' },
  // },
  // {
  //   path: 'inventario-por-usuario',
  //   canActivate: [AuthGuard],
  //   loadComponent: () =>
  //     import('../../business/inventario/inventario-por-usuario/inventario-por-usuario.component').then(
  //       (m) => m.InventarioPorUsuarioComponent,
  //     ),
  //   data: { title: 'Inventario por usuario' },
  // },
  // {
  //   path: 'dashboard',
  //   canActivate: [AuthGuard],
  //   loadComponent: () =>
  //     import('../../business/dashboard/dashboard.component').then(
  //       (m) => m.DashboardComponent,
  //     ),
  //   data: {
  //     title: 'Dashboard',
  //   },
  // },
  // {
  //   path: 'actas',
  //   canActivate: [AuthGuard],
  //   loadComponent: () =>
  //     import('../../business/actas/actas.component').then(
  //       (m) => m.ActasComponent,
  //     ),
  //   data: { title: 'Historial de Actas' },
  // },
  // {
  //   path: '**',
  //   redirectTo: 'auth/login',
  // },
];
