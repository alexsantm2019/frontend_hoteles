import { NavItem } from '../models/NavItem.models';

// Este archivo se importa en sidebar-data.ts dentro de UI
const ddtype = '1';
export const NavMenuItems: NavItem[] = [
  // {
  //   displayName: 'Usuario logueado',
  //   iconName: 'layout-dashboard',
  //   bgcolor: 'primary',
  //   route: '/business/prueba',
  //   ddType: ddtype,
  // },
  // {
  //   displayName: 'Hoteles',
  //   iconName: 'layout-dashboard',
  //   bgcolor: 'primary',
  //   route: '/selector-hotel',
  //   ddType: ddtype,
  // },
  {
    displayName: 'Estructura',
    iconName: 'layout-dashboard',
    bgcolor: 'primary',
    route: '/business/estructura',
    ddType: ddtype,
  },
  {
    displayName: 'Reservas',
    iconName: 'calendar-event', // Ícono de Tabler
    bgcolor: 'primary',
    route: '/business/reservas',
    ddType: ddtype,
  },
  {
    displayName: 'Huéspedes',
    iconName: 'users', // Ícono de Tabler
    bgcolor: 'primary',
    route: '/business/huespedes',
    ddType: ddtype,
  },
  {
    displayName: 'Tablero',
    iconName: 'layout-grid', // Ícono de Tabler
    bgcolor: 'primary',
    route: '/business/tablero',
    ddType: ddtype,
  },
  {
    displayName: 'Caja',
    iconName: 'cash-register',
    bgcolor: 'primary',
    route: '/business/caja',
    ddType: ddtype,
  },
  {
    displayName: 'Servicios',
    iconName: 'tools-kitchen-2', // o 'coffee'
    bgcolor: 'primary',
    route: '/business/servicios',
    ddType: ddtype,
  },
  {
    displayName: 'Inventario',
    iconName: 'shield',
    route: '',
    ddType: ddtype,
    // permission: 'superadmin',
    children: [
      {
        displayName: 'Productos',
        iconName: 'tools-kitchen-2', // o 'coffee'
        bgcolor: 'primary',
        route: '/business/productos',
      },
      {
        displayName: 'Stock',
        iconName: 'tools-kitchen-2', // o 'coffee'
        bgcolor: 'primary',
        route: '/business/stock',
      },
    ],
  },
  {
    displayName: 'Temporadas',
    iconName: 'calendar-event',
    bgcolor: 'primary',
    route: '/business/temporadas',
    ddType: ddtype,
  },
  {
    displayName: 'Dashboard',
    iconName: 'calendar-event',
    bgcolor: 'primary',
    route: '/business/dashboard',
    ddType: ddtype,
  },
  {
    displayName: 'Usuarios',
    iconName: 'users',
    bgcolor: 'primary',
    route: '/business/usuarios',
    ddType: ddtype,
  },
  // {
  //   displayName: 'Admin Dashboard',
  //   iconName: 'users',
  //   bgcolor: 'primary',
  //   route: '/admin/admin-dashboard',
  //   ddType: ddtype,
  // },
  {
    displayName: 'Empresas',
    iconName: 'users',
    bgcolor: 'primary',
    route: '/admin/empresas',
    ddType: ddtype,
  },
  // {
  //   displayName: 'Configuración',
  //   iconName: 'shield',
  //   route: '',
  //   ddType: ddtype,
  //   // permission: 'superadmin',
  //   children: [
  //     {
  //       displayName: 'Categorias',
  //       iconName: 'layout-dashboard',
  //       bgcolor: 'primary',
  //       route: '/business/categorias',
  //     },
  //     {
  //       displayName: 'Tipos',
  //       iconName: 'category',
  //       bgcolor: 'primary',
  //       route: '/business/tipos',
  //     },
  //     {
  //       displayName: 'Ubicaciones',
  //       iconName: 'map-pin',
  //       bgcolor: 'primary',
  //       route: '/business/ubicaciones',
  //     },
  //   ],
  // },

  // {
  //   displayName: 'Activos',
  //   iconName: 'map-pin',
  //   bgcolor: 'primary',
  //   route: '/business/activos',
  //   ddType: ddtype,
  // },
  // {
  //   displayName: 'Asignaciones',
  //   iconName: 'map-pin',
  //   bgcolor: 'primary',
  //   route: '/business/asignaciones',
  //   ddType: ddtype,
  // },
  // {
  //   displayName: 'Inventario',
  //   iconName: 'shield',
  //   route: '',
  //   ddType: ddtype,
  //   // permission: 'superadmin',
  //   children: [
  //     {
  //       displayName: 'Resumen Inventario',
  //       iconName: 'chart-pie',
  //       bgcolor: 'primary',
  //       route: '/business/inventario-agrupado',
  //       ddType: ddtype,
  //     },
  //     {
  //       displayName: 'Inventario por usuario',
  //       iconName: 'users',
  //       bgcolor: 'primary',
  //       route: '/business/inventario-por-usuario',
  //       ddType: ddtype,
  //     },
  //     {
  //       displayName: 'Actas de entrega',
  //       iconName: 'file-text',
  //       bgcolor: 'primary',
  //       route: '/business/actas',
  //       ddType: ddtype,
  //     },
  //   ],
  // },
];
